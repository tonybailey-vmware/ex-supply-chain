/*
 * Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import {generate} from "./generateParties";

it('renders without crashing', () => {
  const actual = generate([]);
  const expected = "";
  expect(actual).toStrictEqual(expected)
});
