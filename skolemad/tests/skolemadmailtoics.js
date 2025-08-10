import test from 'node:test'
import assert from 'node:assert/strict'

import { skolemademailToIcs } from "../skolemademailtoics.js";

test("perfectInputData_date_format_1", () => {
    const emailText = `
Betalingen vedrører følgende køb:   \r\n\
Navn: \tTest Name\r\n\
Ordre nummer: \t25693434\r\n\
Produkt: \tLasagne med kødsovs af grønt og hjerter. Hertil frugt\r\n\
Udleveringsdato: \t2024-11-20T12:00:00+01:00\r\n\
Antal: \t1\r\n\
Pris: \t27.00 kr.\r\n\
Produkt: \tStegt kyllingelår med kartofler, tomater og krydderurtedressing\r\n\
Udleveringsdato: \t2024-11-21T12:00:00+01:00\r\n\
Antal: \t1\r\n\
Pris: \t27.00 kr.\r\n`;
   const result = skolemademailToIcs(emailText);
   assert.equal(result.error, '');
   assert.notEqual(-1, result.text.search("DTSTART;VALUE=DATE:20241120"));
   assert.notEqual(-1, result.text.search("DTSTART;VALUE=DATE:20241121"));
});

test("perfectInputData_date_format_2", () => {
    const emailText = `
Betalingen vedrører følgende køb:   \r\n\
Navn: \tTest Name\r\n\
Ordre nummer: \t25693434\r\n\
Produkt: \tLasagne med kødsovs af grønt og hjerter. Hertil frugt\r\n\
Udleveringsdato: \t15-08-2025 12:00\r\n\
Antal: \t1\r\n\
Pris: \t27.00 kr.\r\n\
Produkt: \tStegt kyllingelår med kartofler, tomater og krydderurtedressing\r\n\
Udleveringsdato: \t01-08-2025 12:00\r\n\
Antal: \t1\r\n\
Pris: \t27.00 kr.\r\n`;
   const result = skolemademailToIcs(emailText);
   assert.equal(result.error, '');
   assert.notEqual(-1, result.text.search("DTSTART;VALUE=DATE:20250815"));
   assert.notEqual(-1, result.text.search("DTSTART;VALUE=DATE:20250801"));
});

test("noName", () => {
    const emailText = "";
    const result = skolemademailToIcs(emailText);
    assert.equal(result.error, "can\'t find a \'Navn\'");
    assert.equal(result.text, "");
});

test("noProducts", () => {
    const emailText = `
Betalingen vedrører følgende køb:   \r\n\
Navn: \tTest Name\r\n\
Ordre nummer: \t2569343\
Pris: \t27.00 kr.\r\n`;

    const result = skolemademailToIcs(emailText);
    assert.equal(result.error, "no products");
    assert.equal(result.text, "");
});

test("noDate", () => {
    const emailText = `
Betalingen vedrører følgende køb:   \r\n\
Navn: \tTest Name\r\n\
Ordre nummer: \t25693434\r\n\
Produkt: \tLasagne med kødsovs af grønt og hjerter. Hertil frugt\r\n\
Pris: \t27.00 kr.\r\n`;

    const result = skolemademailToIcs(emailText);
    assert.equal(result.error, "can\'t find a \'Udleveringsdato:\'");
    assert.equal(result.text, "");
});