/**
 * Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
 */
package com.digitalasset.refapps.supplychain;

import static org.junit.Assert.*;

import com.daml.ledger.javaapi.data.Command;
import com.daml.ledger.javaapi.data.ExerciseCommand;
import com.daml.ledger.javaapi.data.Template;
import com.daml.ledger.rxjava.components.LedgerViewFlowable;
import com.daml.ledger.rxjava.components.helpers.CommandsAndPendingSet;
import com.digitalasset.refapps.supplychain.util.CommandsAndPendingSetBuilder;
import da.refapps.supplychain.main.*;
import da.refapps.supplychain.types.WarehouseAllocation;
import da.types.Tuple2;
import java.lang.reflect.InvocationTargetException;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.Duration;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.checkerframework.checker.nullness.qual.NonNull;
import org.junit.Test;
import org.pcollections.HashTreePMap;

public class ChooseTransportBotTest {

  private static final String PARTY = "TESTPARTY";

  CommandsAndPendingSetBuilder.Factory commandBuilder =
      CommandsAndPendingSetBuilder.factory("appId", Clock::systemUTC, Duration.ofSeconds(5));
  private LedgerViewFlowable.LedgerTestView<Template> ledgerView;
  private ChooseTransportBot bot = new ChooseTransportBot(commandBuilder, PARTY);

  @Test
  public void calculateCommands() throws InvocationTargetException, IllegalAccessException {
    ledgerView =
        new LedgerViewFlowable.LedgerTestView(
            HashTreePMap.empty(), HashTreePMap.empty(), HashTreePMap.empty(), HashTreePMap.empty());

    QuoteRequest.ContractId quoteId = new QuoteRequest.ContractId("Q1");
    QuoteRequest.ContractId otherQuoteId = new QuoteRequest.ContractId("Q2");

    ChooseTransportBotTrigger trigger =
        new ChooseTransportBotTrigger(
            quoteId, "supplier", "buyer", "seller", Collections.emptyList());

    Tuple2<WarehouseAllocation, TransportQuoteItem> item = new Tuple2(null, null);

    TransportQuote tq = new TransportQuote(quoteId, "transportCompany", "supplier", item);
    TransportQuote tq2 = new TransportQuote(otherQuoteId, "transportCompany", "supplier", item);
    InventoryQuote invQ =
        new InventoryQuote(quoteId, "warehouse", "supplier", "product", 1L, BigDecimal.ONE);
    InventoryItem invItem =
        new InventoryItem("warehouse", "supplier", "product", 1L, BigDecimal.ONE);
    ledgerView =
        ledgerView
            .addActiveContract(ChooseTransportBotTrigger.TEMPLATE_ID, "cid-01", trigger)
            .addActiveContract(TransportQuote.TEMPLATE_ID, "cid-02", tq)
            .addActiveContract(TransportQuote.TEMPLATE_ID, "cid-03", tq2)
            .addActiveContract(InventoryQuote.TEMPLATE_ID, "cid-04", invQ)
            .addActiveContract(InventoryItem.TEMPLATE_ID, "cid-05", invItem);

    CommandsAndPendingSet cmds = bot.calculateCommands(ledgerView).blockingFirst();

    @NonNull List<Command> actualCommands = cmds.getSubmitCommandsRequest().getCommands();
    assertEquals(1, actualCommands.size());
    actualCommands.forEach(
        cmd -> {
          Optional<ExerciseCommand> exerciseCommand = cmd.asExerciseCommand();
          assertTrue(exerciseCommand.isPresent());
          assertEquals("ChooseTransportBotTrigger_Proceed", exerciseCommand.get().getChoice());
        });
  }
}
