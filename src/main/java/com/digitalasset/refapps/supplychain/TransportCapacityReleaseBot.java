/**
 * Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
 */
package com.digitalasset.refapps.supplychain;

import static com.digitalasset.refapps.supplychain.util.TemplateManager.filterTemplates;

import com.daml.ledger.javaapi.data.*;
import com.daml.ledger.rxjava.components.LedgerViewFlowable;
import com.daml.ledger.rxjava.components.helpers.CommandsAndPendingSet;
import com.daml.ledger.rxjava.components.helpers.CreatedContract;
import com.digitalasset.refapps.supplychain.util.BotLogger;
import com.digitalasset.refapps.supplychain.util.CommandsAndPendingSetBuilder;
import com.google.common.collect.Sets;
import da.refapps.supplychain.main.TransportCapacityReleaseTrigger;
import io.reactivex.Flowable;
import java.util.Collections;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;

public class TransportCapacityReleaseBot {

  private final Logger logger;
  private final CommandsAndPendingSetBuilder commandBuilder;

  public final TransactionFilter transactionFilter;

  public TransportCapacityReleaseBot(
      CommandsAndPendingSetBuilder.Factory commandBuilderFactory, String partyName) {
    String workflowId =
        "WORKFLOW-" + partyName + "-TransportCapacityReleaseBot-" + UUID.randomUUID().toString();
    logger = BotLogger.getLogger(TransportCapacityReleaseBot.class, workflowId);

    commandBuilder = commandBuilderFactory.create(partyName, workflowId);

    Filter messageFilter =
        new InclusiveFilter(Sets.newHashSet(TransportCapacityReleaseTrigger.TEMPLATE_ID));

    this.transactionFilter = new FiltersByParty(Collections.singletonMap(partyName, messageFilter));

    logger.info("Startup.");
  }

  public Flowable<CommandsAndPendingSet> calculateCommands(
      LedgerViewFlowable.LedgerView<Template> ledgerView) {

    CommandsAndPendingSetBuilder.Builder builder = commandBuilder.newBuilder();

    Map<String, TransportCapacityReleaseTrigger> aggregatedQuoteBotTriggers =
        filterTemplates(
            TransportCapacityReleaseTrigger.class,
            ledgerView.getContracts(TransportCapacityReleaseTrigger.TEMPLATE_ID));

    for (Map.Entry<String, TransportCapacityReleaseTrigger> e :
        aggregatedQuoteBotTriggers.entrySet()) {
      builder.addCommand(
          new TransportCapacityReleaseTrigger.ContractId(e.getKey())
              .exerciseTransportCapacityReleaseTrigger_Release());
    }

    return builder
        .buildFlowable()
        .doOnError(err -> logger.error("There was an error: {}", err.getMessage()));
  }

  public Template getContractInfo(CreatedContract createdContract) {
    Record args = createdContract.getCreateArguments();
    if (createdContract.getTemplateId().equals(TransportCapacityReleaseTrigger.TEMPLATE_ID)) {
      return TransportCapacityReleaseTrigger.fromValue(args);
    } else {
      String msg =
          "TransportCapacityReleaseBot encountered an unknown contract of type "
              + createdContract.getTemplateId();
      logger.error(msg);
      throw new IllegalStateException(msg);
    }
  }
}
