const jwt = require('jsonwebtoken');

const participantNames = ["buyer", "seller", "supplier", "warehouse1", "warehouse2", "transportCompany1", "transportCompany2"];

function generate(participantNames) {
    const ledgerId = "demo";
    const applicationId = "";
    const participants = {};
    const partyParticipants = {};
    participantNames.forEach( party =>
        {
            const token =
                jwt.sign({
                    "https://daml.com/ledger-api":
                        { ledgerId, applicationId, admin: true, actAs: [party], readAs: [party] } },
                    "secret",
                    { noTimestamp: true });
            participants[party] = { host: "localhost", port: 6865, access_token: token };
        }
    )
    participantNames.forEach( party =>
        {
            partyParticipants[`ledger-party-${party}`] = party;
        }
    )

    return {
        "default_participant": participants[participantNames[0]] || {},
        "participants": participants,
        "party_participants": partyParticipants
    }
}
exports.generate = generate

console.log(JSON.stringify(generate(participantNames), null, 2));
