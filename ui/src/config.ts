///
/// Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
/// SPDX-License-Identifier: Apache-2.0
///

import * as jwt from "jsonwebtoken";

let host = window.location.host.split('.')

export const ledgerId = "supply-chain";

let apiUrl = host.slice(1)
apiUrl.unshift('api')

export const httpBaseUrl = process.env.REACT_APP_HTTP_BASE_URL as string;
export const wsBaseUrl = process.env.REACT_APP_WS_BASE_URL as string;

console.log(`JSON API proxy: ${httpBaseUrl}`);
console.log(`JSON API WS proxy: ${wsBaseUrl}`);

const applicationId = "supply-chain";

export function createToken(party : string): string {
    return jwt.sign({ "https://daml.com/ledger-api": { ledgerId, applicationId, admin: true, actAs: [party], readAs: [party] } }, "secret")
}

let loginUrl = host.slice(1)
loginUrl.unshift('login')

export const dablLoginUrl = loginUrl.join('.') + (window.location.port ? ':' + window.location.port : '') + '/auth/login?ledgerId=' + ledgerId;
