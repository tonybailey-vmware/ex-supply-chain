const fs = require('fs');
const jwt = require('jsonwebtoken');

// var stream = fs.createWriteStream("parties.json");

const participantNames = ["buyer", "seller", "supplier", "warehouse1", "warehouse2", "transportCompany1", "transportCompany2"];

// stream.once('open', function() {
//   stream.write(JSON.stringify(Object.fromEntries(Object.entries(participants.party_participants)
//   .filter(participant =>
//         desiredParties.includes(participant[1]))
//   .map(participant =>
//         [participant[1], participant[0]])
//   )));
//   stream.end();
// });



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

console.log(JSON.stringify(generate(participantNames)));
