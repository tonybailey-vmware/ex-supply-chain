package com.digitalasset.refapps.supplychain;

import com.daml.ledger.javaapi.data.DamlList;
import com.daml.ledger.javaapi.data.Party;
import com.daml.ledger.javaapi.data.Record;
import com.daml.ledger.javaapi.data.Text;
import com.daml.ledger.rxjava.DamlLedgerClient;
import com.digitalasset.testing.comparator.ledger.CustomChoiceExecuted;
import com.digitalasset.testing.comparator.ledger.CustomContractCreated;
import com.digitalasset.testing.ledger.DefaultLedgerAdapter;
import com.digitalasset.testing.ledger.SandboxRunner;
import com.digitalasset.testing.ledger.clock.SandboxTimeProviderFactory$;
import da.refapps.supplychain.quoterequest.QuoteRequest;
import da.refapps.supplychain.relationship.BuyerSellerRelationship;
import da.refapps.supplychain.types.OrderedProduct;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import com.digitalasset.testing.store.*;
import scala.concurrent.duration.FiniteDuration;
import scala.util.Right;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.concurrent.atomic.AtomicReference;

import static junit.framework.TestCase.assertEquals;

public class SupplychainIT {
    private static final BuyerSellerRelationship.ContractId CID_OF_BUYER_SELLER_RELATIONSHIP =
            new BuyerSellerRelationship.ContractId("#1:1");

    private Process sandbox = null;
    private ExecutorService bots = null;
    private DamlLedgerClient client = null;
    private AtomicReference<Instant> time = new AtomicReference<>();
    private static final String RELATIVE_DAR_PATH = "./target/supplychain.dar";
    private static final Integer sandboxPort = 6865;
    private static final int WAIT_TIMEOUT = 20;
    private static final Instant START_TIME =
            LocalDate.of(2019, 3, 21).atStartOfDay().toInstant(ZoneOffset.UTC);
    private static final String TEST_MODULE = "DA.RefApps.SupplyChain.Scenarios";
    private static final String TEST_SCENARIO = "setup";

    private DefaultLedgerAdapter lA;
    private SandboxRunner sbRunner;

    private Party BUYER_PARTY = new Party("Buyer");
    private Party SELLER_PARTY = new Party("Seller");
    private Text BUYER_ADDRESS = new Text("1234, Vice City, Arkham street 13");

    @Before
    public void before() throws IOException, InterruptedException {
        lA = new DefaultLedgerAdapter(new DefaultValueStore(), SandboxTimeProviderFactory$.MODULE$,
                    "localhost", sandboxPort, FiniteDuration.apply(5, TimeUnit.SECONDS));
        sbRunner = new SandboxRunner(RELATIVE_DAR_PATH, TEST_MODULE, TEST_SCENARIO, sandboxPort, START_TIME, WAIT_TIMEOUT);
        sbRunner.startSandboxWithBots();
        lA.start(new String[] {"Buyer"});
    }

    @After
    public void after() {
        lA.stop();
        sbRunner.stopSandboxAndBots();
    }

    @Test
    public void testBuyerSellerRelationshipIsPresent() throws IOException {
        List<Record.Field> fields1 =
                Arrays.asList(
                        new Record.Field(BUYER_PARTY),
                        new Record.Field(BUYER_ADDRESS),
                        new Record.Field(SELLER_PARTY));
        Record expected1 = new Record(fields1);
        lA.observeEvent("Buyer",
                CustomContractCreated.apply(BuyerSellerRelationship.TEMPLATE_ID,
                        "{CAPTURE:observedBuyerSellerCid}",
                                        Right.<String, Record>apply(expected1)));

        BuyerSellerRelationship.ContractId cidOfBuyerSellerRelationship =
                new BuyerSellerRelationship.ContractId(lA.valueStore().get("observedBuyerSellerCid"));
        assertEquals(cidOfBuyerSellerRelationship, CID_OF_BUYER_SELLER_RELATIONSHIP);

        // Send a quote request
        OrderedProduct orderedProduct =
                new OrderedProduct("Product1", 10L,
                                    LocalDate.of(2019,6,6),
                                    LocalDate.of(2019,6,7));
        lA.exerciseChoiceJava(BUYER_PARTY.getValue(),
                              BuyerSellerRelationship.TEMPLATE_ID,
                              cidOfBuyerSellerRelationship.contractId,
                            "BuyerSellerRelationship_SendQuoteRequest",
                              new Record(new Record.Field(new DamlList(orderedProduct.toValue()))));

        lA.observeEvent(BUYER_PARTY.getValue(), CustomChoiceExecuted.apply(BuyerSellerRelationship.TEMPLATE_ID,
                "{CAPTURE:xyz}",
                "BuyerSellerRelationship_SendQuoteRequest",
                                    new Record(new Record.Field(new DamlList(orderedProduct.toValue())))));

        List<Record.Field> fields2 =
                Arrays.asList(
                        new Record.Field("buyer", BUYER_PARTY),
                        new Record.Field("buyerAddress", BUYER_ADDRESS),
                        new Record.Field("seller", SELLER_PARTY),
                        new Record.Field("products", new DamlList(orderedProduct.toValue())));
        Record expected2 = new Record(fields2);
        lA.observeEvent(BUYER_PARTY.getValue(), CustomContractCreated.apply(QuoteRequest.TEMPLATE_ID,
                "{CAPTURE:observedQuoteRequest}", Right.<String, Record>apply(expected2)));
    }

    @Test(expected = TimeoutException.class)
    public void testAddressIsNotWrong() throws IOException {
        List<Record.Field> fields =
                Arrays.asList(
                        new Record.Field(new Party("Buyer")),
                        new Record.Field(new Text("1234, Grammar Error City, Arkham street 13")),
                        new Record.Field(new Party("Someone1")));
        Record expected = new Record(fields);
        lA.observeEvent(
                "Buyer",
                CustomContractCreated.
                        apply(BuyerSellerRelationship.TEMPLATE_ID,
                                "{CAPTURE:cid01}",
                                Right.<String, Record>apply(expected)));

        BuyerSellerRelationship.ContractId cidOfBuyerSellerRelationship =
                new BuyerSellerRelationship.ContractId(lA.valueStore().get("someCid"));
    }

}
