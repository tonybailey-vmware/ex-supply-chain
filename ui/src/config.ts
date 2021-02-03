///
/// Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
/// SPDX-License-Identifier: Apache-2.0
///

import * as jwt from "jsonwebtoken";
import { addTrailingSlashIfNeeded } from "./components/Util";
import { convertPartiesJson } from '@daml/dabl-react';

export const httpBaseUrl = addTrailingSlashIfNeeded(process.env.REACT_APP_HTTP_BASE_URL as string);
export const wsBaseUrl = addTrailingSlashIfNeeded(process.env.REACT_APP_WS_BASE_URL as string);

console.log(`JSON API: ${httpBaseUrl}`);
console.log(`JSON API WS: ${wsBaseUrl}`);

export const ledgerId = "supply-chain";

const applicationId = "supply-chain";
let host = window.location.host.split('.')
let loginUrl = host.slice(1)
loginUrl.unshift('login')
export const dablLoginUrl = loginUrl.join('.') + (window.location.port ? ':' + window.location.port : '') + '/auth/login?ledgerId=' + ledgerId;
export const isDevMode = process.env.NODE_ENV === 'development'

export function createToken(party: string): string {
    if (isDevMode) {
        console.log("Using generated token.");
        return jwt.sign({ "https://daml.com/ledger-api": { ledgerId, applicationId, admin: true, actAs: [party], readAs: [party] } }, "secret");
    } else {
        console.log("Using token from parties.json file.");
        const parties = retrieveParties();
        const partyInfo = parties?.find(o => o.partyName === party);
        if (partyInfo && partyInfo.token) {
            return partyInfo.token;
        }
        alert(`Warning: no credentials available for ${party}.`);
        return "undefined";
    }
}

export const handlePartiesLoad = async (parties: any) => {
    try {
        storeParties(parties);
    } catch (e) {
        alert(`Error while trying to store parties: ${e}`);
    }
}

const PARTIES_STORAGE_KEY = 'imported_parties';

function storeParties(partiesJson: any) {
    localStorage.setItem(PARTIES_STORAGE_KEY, JSON.stringify(partiesJson));
}

export function retrieveParties(validateParties: any = false) {
    const partiesJson = localStorage.getItem(PARTIES_STORAGE_KEY);

    if (!partiesJson) {
        return undefined;
    }

    const [ parties, error ] = convertPartiesJson(partiesJson, ledgerId, true);

    if (error) {
        console.warn("Tried to load an invalid parties file from cache.", error);

        localStorage.removeItem(PARTIES_STORAGE_KEY);
        return undefined;
    }

    return parties;
}
