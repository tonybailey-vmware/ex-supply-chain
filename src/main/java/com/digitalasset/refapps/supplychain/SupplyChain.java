/**
 * Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
 */
package com.digitalasset.refapps.supplychain;

import com.daml.ledger.javaapi.data.ExerciseCommand;
import com.daml.ledger.rxjava.CommandSubmissionClient;
import com.daml.ledger.rxjava.DamlLedgerClient;
import com.daml.ledger.rxjava.components.Bot;
import com.daml.ledger.rxjava.components.helpers.Pair;
import com.digitalasset.refapps.supplychain.util.CliOptions;
import com.digitalasset.refapps.supplychain.util.CommandsAndPendingSetBuilder;
import com.google.protobuf.Empty;
import io.reactivex.Flowable;
import io.reactivex.Single;
import io.reactivex.disposables.Disposable;
import io.reactivex.functions.BiFunction;
import io.reactivex.functions.Function;
import io.reactivex.processors.MulticastProcessor;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SupplyChain {
  public static final String APPLICATION_ID = "direct-asset-control";
  public static final String GLOBAL_CUSTODIAN = "Global_Custodian";
  public static final String DCC_LOCAL_CUSTODIAN_1 = "US_Local_Custodian";
  public static final String DCC_LOCAL_CUSTODIAN_2 = "Swiss_Local_Custodian";
  private static final Logger logger = LoggerFactory.getLogger(SupplyChain.class);
  private static final AtomicReference<Clock> clock =
      new AtomicReference<>(Clock.fixed(Instant.ofEpochSecond(0), ZoneId.systemDefault()));

  public static BiFunction<String, String, Function<Pair<ExerciseCommand, Instant>, Single<Empty>>>
      commandSender(CommandSubmissionClient client) {
    return (party, workflowId) -> {
      return p -> {
        String cmdId = UUID.randomUUID().toString();
        Instant let = p.getSecond();
        Instant mrt = let.plusSeconds(5);
        return client.submit(
            workflowId,
            APPLICATION_ID,
            cmdId,
            party,
            let,
            mrt,
            Collections.singletonList(p.getFirst()));
      };
    };
  }

  public static void main(String[] args) throws Exception {
    CliOptions options = CliOptions.parseArgs(args);
    MulticastProcessor<Instant> time = MulticastProcessor.create();

    DamlLedgerClient client =
        DamlLedgerClient.forHostWithLedgerIdDiscovery(
            options.getSandboxHost(), options.getSandboxPort(), Optional.empty());

    waitForSandbox(options, client);

    logger.info("Sandbox is started on port: {}", options.getSandboxPort());

    Flowable<Instant> clockFlowable =
        client
            .getTimeClient()
            .getTime()
            .doOnNext(ts -> logger.info("Received time change {}", ts))
            .doOnNext(ts -> clock.set(Clock.fixed(ts, ZoneId.systemDefault())));

    Duration mrt = Duration.ofSeconds(10);
    CommandsAndPendingSetBuilder.Factory commandBuilderFactory =
        CommandsAndPendingSetBuilder.factory(APPLICATION_ID, clock::get, mrt);
  }

  private static void shutdown(
      Disposable swiftBot1, Disposable swiftBot2, DamlLedgerClient client) {
    swiftBot1.dispose();
    swiftBot2.dispose();
    try {
      client.close();
    } catch (Exception ignored) {
    }
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
        logger.info(String.format("Connecting to sandbox at %s:%s", host, port));
        try {
          Thread.sleep(1000);
        } catch (InterruptedException ignored) {
        }
      }
    }
  }
}
