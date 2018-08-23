"use strict";

const GSM_7BIT_CHARS = "@£$¥èéùìòÇ\\nØø\\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !\\\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà"
const GSM_7BIT_EX_CHARS = "\\^{}\\\\\\[~\\]|€"

const GSM_7BIT_RE = RegExp("^[" + GSM_7BIT_CHARS + "]*$")
const GSM_7BIT_EX_RE = RegExp("^[" + GSM_7BIT_CHARS + GSM_7BIT_EX_CHARS + "]*$")
const GSM_7BIT_EX_ONLY_RE = RegExp("^[\\" + GSM_7BIT_EX_CHARS + "]*$")

const GSM_7BIT_ESC = '\u001b'

const GSM_7BIT = 'GSM_7BIT'
const GSM_7BIT_EX = 'GSM_7BIT_EX'
const UTF16 = 'UTF16'

const MESSAGE_LENGTH = {
  GSM_7BIT: 160,
  GSM_7BIT_EX: 160,
  UTF16: 70,
}

const MULTI_MESSAGE_LENGTH = {
  GSM_7BIT: 153,
  GSM_7BIT_EX: 153,
  UTF16: 67,
}

function detectEncoding(text) {
  if (!!text.match(GSM_7BIT_RE)) {
    return GSM_7BIT
  } else if (!!text.match(GSM_7BIT_EX_RE)) {
    return GSM_7BIT_EX
  } else {
    return UTF16
  }
}

function countGSM7BitEx(text) {
  let gsm7BitChars = ''
  let gsm7BitExChars = ''

  for (let i in text) {
    let char = text.charAt(i)
    if (!!char.match(GSM_7BIT_EX_ONLY_RE)) {
      gsm7BitExChars += char
    } else {
      gsm7BitChars += char
    }
  }
  // GMS 7BIT Extended characters are counted as 2 char
  // Escape character 0x1B; required to access Extended characters
  return gsm7BitChars.length + (gsm7BitExChars.length * 2)
}

function count(text) {
  const encoding = detectEncoding(text)
  let length = text.length
  if (encoding === GSM_7BIT_EX) {
    length = countGSM7BitEx(text)
  }
  return length
}

function parts(text) {
  const encoding = detectEncoding(text)
  const length = count(text)
  let parts = 1

  const isMultipart = length > MESSAGE_LENGTH[encoding]
  if (!isMultipart) return parts

  const perMessageLength = MULTI_MESSAGE_LENGTH[encoding]
  if (!!~[GSM_7BIT, UTF16].indexOf(encoding)) return Math.ceil(length / perMessageLength);

  let smsEncodedText = ''
  // Handling GSM 7BIT Extended Characters
  for (let i in text) {
    let char = text[i]
    // Add escape character 0x1B; before the extended character
    if (!!char.match(GSM_7BIT_EX_ONLY_RE)) {
      smsEncodedText += GSM_7BIT_ESC
    }
    smsEncodedText += char
  }

  let c = 0
  for (let i in smsEncodedText) {
    c += 1
    let char = smsEncodedText[i]
    // If the last character of an sms part is an escape character 0x1B;
    // We need to push it through the next part alsongside with the extended chracter'
    if (c === 153 && char === GSM_7BIT_ESC) {
      c = 1
      parts += 1
    } else if (c === 153) {
      c = 0
      parts += 1
    }
  }

  return parts
}

module.exports = {
  count: count,
  detectEncoding: detectEncoding,
  parts: parts,
}
