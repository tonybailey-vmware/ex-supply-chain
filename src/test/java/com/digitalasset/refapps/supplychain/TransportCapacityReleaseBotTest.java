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
import java.lang.reflect.InvocationTargetException;
import java.time.Clock;
import java.time.Duration;
import java.util.List;
import java.util.Optional;
import org.checkerframework.checker.nullness.qual.NonNull;
import org.junit.Test;
import org.pcollections.HashTreePMap;

public class TransportCapacityReleaseBotTest {

  private static final String PARTY = "TESTPARTY";

  CommandsAndPendingSetBuilder.Factory commandBuilder =
      CommandsAndPendingSetBuilder.factory("appId", Clock::systemUTC, Duration.ofSeconds(5));
  private LedgerViewFlowable.LedgerTestView<Template> ledgerView;
  private TransportCapacityReleaseBot bot = new TransportCapacityReleaseBot(commandBuilder, PARTY);

  @Test
  public void calculateCommands() throws InvocationTargetException, IllegalAccessException {
    ledgerView =
        new LedgerViewFlowable.LedgerTestView(
            HashTreePMap.empty(), HashTreePMap.empty(), HashTreePMap.empty(), HashTreePMap.empty());

    LockedTransportCapacity.ContractId lockedCap1 =
        new LockedTransportCapacity.ContractId("cid-01");
    LockedTransportCapacity.ContractId lockedCap2 =
        new LockedTransportCapacity.ContractId("cid-02");

    QuoteRequest.ContractId quoteId = new QuoteRequest.ContractId("Q1");

    TransportCapacityReleaseTrigger tCrT1 =
        new TransportCapacityReleaseTrigger(quoteId, "transportCompany", lockedCap1);
    TransportCapacityReleaseTrigger tCrT2 =
        new TransportCapacityReleaseTrigger(quoteId, "transportCompany", lockedCap2);

    ledgerView =
        ledgerView
            .addActiveContract(TransportCapacityReleaseTrigger.TEMPLATE_ID, "cid-03", tCrT1)
            .addActiveContract(TransportCapacityReleaseTrigger.TEMPLATE_ID, "cid-04", tCrT2);

    CommandsAndPendingSet cmds = bot.calculateCommands(ledgerView).blockingFirst();

    @NonNull List<Command> actualCommands = cmds.getSubmitCommandsRequest().getCommands();
    assertEquals(2, actualCommands.size());
    actualCommands.forEach(
        cmd -> {
          Optional<ExerciseCommand> exerciseCommand = cmd.asExerciseCommand();
          assertTrue(exerciseCommand.isPresent());
          assertEquals(
              "TransportCapacityReleaseTrigger_Release", exerciseCommand.get().getChoice());
        });
  }
}
