/*
 * Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import {generate} from "./generateParties";

it('renders without crashing', () => {
  const actual = generate(["Apple"]);
  const expected =
     {
       "default_participant": {},
       "participants": {
         "Apple": {
           "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2RhbWwuY29tL2xlZGdlci1hcGkiOnsibGVkZ2VySWQiOiJkZW1vIiwiYXBwbGljYXRpb25JZCI6IiIsImFkbWluIjp0cnVlLCJhY3RBcyI6WyJBcHBsZSJdLCJyZWFkQXMiOlsiQXBwbGUiXX19.mkKJb0yr8thyMt689f-JH5nMtV20GqHy9pyR-Ky6NNw",
           "host": "localhost",
           "port": "6865",
         },
       },
       "party_participants": {},
     };
  expect(actual).toStrictEqual(expected)
});
