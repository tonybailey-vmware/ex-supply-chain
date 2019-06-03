package com.digitalasset.refapps.supplychain;

import com.daml.ledger.rxjava.DamlLedgerClient;
import com.digitalasset.ledger.api.v1.transaction.TreeEvent;
import com.digitalasset.refapps.supplychain.util.CliOptions;
import com.digitalasset.testing.comparator.MessageTester;
import com.digitalasset.testing.ledger.DefaultLedgerAdapter;
import com.digitalasset.testing.ledger.LedgerAdapter;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import com.digitalasset.testing.store.*;

import java.io.File;
import java.io.IOException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Optional;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicReference;

public class SupplychainIT {
    private Process sandbox = null;
    private ExecutorService bots = null;
    private DamlLedgerClient client = null;
    private AtomicReference<Instant> time = new AtomicReference<>();
    private static final String RELATIVE_DAR_PATH = "./target/direct-asset-control.dar";
    private static final Integer sandboxPort = 6865;
    private static final int WAIT_TIMEOUT = 20;
    private static final Instant START_TIME =
            LocalDate.of(2019, 3, 21).atStartOfDay().toInstant(ZoneOffset.UTC);
    private static final String TEST_MODULE = "DA.RefApps.SupplyChain.Scenarios";
    private static final String TEST_SCENARIO = "setup";

    private static ProcessBuilder getSandboxRunner(String scenario) {
        return new ProcessBuilder(
                "da",
                "run",
                "sandbox",
                "--",
                "-p",
                sandboxPort.toString(),
                "--scenario",
                String.format("%s:%s", TEST_MODULE, scenario),
                RELATIVE_DAR_PATH)
                .redirectError(new File("integration-test-sandbox.log"))
                .redirectOutput(new File("integration-test-sandbox.log"));
    }

    public static void waitForSandbox(CliOptions options, DamlLedgerClient client) {
        waitForSandbox(options.getSandboxHost(), options.getSandboxPort(), client);
    }

    public static void waitForSandbox(String host, int port, DamlLedgerClient client) {
        boolean connected = false;
        while (!connected) {
            try {
                client.connect();
                connected = true;
            } catch (Exception _ignored) {
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException ignored) {
                }
            }
        }
    }

    @Before
    public void startSandboxWithBots() throws IOException {
        time.set(START_TIME);
        sandbox = getSandboxRunner(TEST_SCENARIO).start();

        bots = Executors.newSingleThreadExecutor();
        bots.execute(
                () -> {
                    try {
                        SupplyChain.main(new String[] {"-p", sandboxPort.toString()});
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });

        client =
                DamlLedgerClient.forHostWithLedgerIdDiscovery("localhost", sandboxPort, Optional.empty());
        waitForSandbox("localhost", sandboxPort, client);
    }

    @After
    public void stopSandboxAndBots() {
        if (client != null) {
            try {
                client.close();

            } catch (Exception e) {
                System.out.println("exception during shutdown: " + e.getMessage());
            }
        }
        client = null;

        if (bots != null) {
            bots.shutdownNow();
        }
        bots = null;
        if (sandbox != null) {
            sandbox.destroy();
        }
        sandbox = null;
    }

    @Test
    public void testGlobalSell() {
        LedgerAdapter lA = new DefaultLedgerAdapter(new DefaultValueStore());
        lA.start(new String[] {"Supplier"});

        lA.observeEvent("Supplier", new MessageTester<TreeEvent>() {
            @Override
            public ComparisonResult test(TreeEvent treeEvent) {
                return treeEvent.getCreated().;
            }

            @Override
            public String prettyPrintExpected() {
                return null;
            }

            @Override
            public String prettyPrintActual(TreeEvent treeEvent) {
                return null;
            }
        });
        ((DefaultLedgerAdapter) lA).valueStore().get()
        lA.stop();
    }

}
