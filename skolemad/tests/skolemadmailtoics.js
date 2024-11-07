import test from 'node:test'
import assert from 'node:assert/strict'

import { skolemademailToIcs } from "../skolemademailtoics.js";

test("normalInput", () => {
    const emailText = `
Betalingen vedrører følgende køb:   \r\n\
Navn: 	Test Name\r\n\
Ordre nummer: 	25693434\r\n\
Produkt: 	Lasagne med kødsovs af grønt og hjerter. Hertil frugt\r\n\
Udleveringsdato: 	2024-11-20T12:00:00+01:00\r\n\
Antal: 	1\r\n\
Pris: 	27.00 kr.\r\n\
Produkt: 	Stegt kyllingelår med kartofler, tomater og krydderurtedressing\r\n\
Udleveringsdato: 	2024-11-21T12:00:00+01:00\r\n\
Antal: 	1\r\n\
Pris: 	27.00 kr.\r\n`

   const result = skolemademailToIcs(emailText);
   assert.equal(result.error, '');
});

test("noName", () => {
    const emailText = "";
    const result = skolemademailToIcs(emailText);
    assert.equal(result.error, "can\'t find a \'Navn\'");
    assert.equal(result.text, "");
})