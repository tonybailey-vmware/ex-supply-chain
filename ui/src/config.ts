///
/// Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
/// SPDX-License-Identifier: Apache-2.0
///

import * as jwt from "jsonwebtoken";
import { addTrailingSlashIfNeeded } from "./components/Util";
import participants from './participants.json';

export const httpBaseUrl = addTrailingSlashIfNeeded(process.env.REACT_APP_HTTP_BASE_URL as string);
export const wsBaseUrl = addTrailingSlashIfNeeded(process.env.REACT_APP_WS_BASE_URL as string);

console.log(`JSON API proxy: ${httpBaseUrl}`);
console.log(`JSON API WS proxy: ${wsBaseUrl}`);

export const ledgerId = "supply-chain";

const applicationId = "supply-chain";
let host = window.location.host.split('.')
let loginUrl = host.slice(1)
loginUrl.unshift('login')
export const dablLoginUrl = loginUrl.join('.') + (window.location.port ? ':' + window.location.port : '') + '/auth/login?ledgerId=' + ledgerId;

// export function createToken(party : string): string {
//     return jwt.sign({ "https://daml.com/ledger-api": { ledgerId, applicationId, admin: true, actAs: [party], readAs: [party] } }, "secret")
// }

export function createToken(party: string): string | undefined {
    if (process.env.NODE_ENV === 'development') {
        console.log("Using token generated token.");
        return jwt.sign({ "https://daml.com/ledger-api": { ledgerId, applicationId, admin: true, actAs: [party], readAs: [party] } }, "secret");
    } else {
        console.log("Using token from participant file.");
        const participantMap = new Map(Object.entries(participants.participants));
        const participantInfo = participantMap.get(lowerCaseFirst(party));
        return participantInfo?.access_token;
    }
}

function lowerCaseFirst(s: string): string {
    return s[0].toLowerCase() + s.slice(1);
}
