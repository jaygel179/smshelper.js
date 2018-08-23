var expect = require('chai').expect;

var SMSHelper = require('../')

describe('SMSHelper test', function() {
  it('should detect correct encoding', function() {
    expect(SMSHelper.detectEncoding('Sample message')).to.equal('GSM_7BIT')
    expect(SMSHelper.detectEncoding('Sample message €')).to.equal('GSM_7BIT_EX')
    expect(SMSHelper.detectEncoding('Sample message \\')).to.equal('GSM_7BIT_EX')
    expect(SMSHelper.detectEncoding('Sample message [')).to.equal('GSM_7BIT_EX')
    expect(SMSHelper.detectEncoding('Sample message ]')).to.equal('GSM_7BIT_EX')
    expect(SMSHelper.detectEncoding('Sample message {')).to.equal('GSM_7BIT_EX')
    expect(SMSHelper.detectEncoding('Sample message }')).to.equal('GSM_7BIT_EX')
    expect(SMSHelper.detectEncoding('Sample message 最高')).to.equal('UTF16')

  });

  it('should return correct count', function() {
    expect(SMSHelper.count('Sample message')).to.equal(14)
    expect(SMSHelper.count('\\€|[]{}')).to.equal(14)
    expect(SMSHelper.count('Sample message €')).to.equal(17)
    expect(SMSHelper.count('最高')).to.equal(2)
    expect(SMSHelper.count('a 最高')).to.equal(4)
  });

  it('should return correct parts', function() {
    expect(SMSHelper.parts('Sample message')).to.equal(1)
    expect(SMSHelper.parts('S'.repeat(160))).to.equal(1)
    expect(SMSHelper.parts('S'.repeat(161))).to.equal(2)
    expect(SMSHelper.parts('S'.repeat(306))).to.equal(2)
    expect(SMSHelper.parts('S'.repeat(307))).to.equal(3)
    expect(SMSHelper.parts('€'.repeat(80))).to.equal(1)
    expect(SMSHelper.parts('€'.repeat(81))).to.equal(2)
    expect(SMSHelper.parts('€'.repeat(152))).to.equal(2)
    expect(SMSHelper.parts('€'.repeat(153))).to.equal(3)
    expect(SMSHelper.parts('最'.repeat(70))).to.equal(1)
    expect(SMSHelper.parts('最'.repeat(71))).to.equal(2)
    expect(SMSHelper.parts('最'.repeat(134))).to.equal(2)
    expect(SMSHelper.parts('最'.repeat(135))).to.equal(3)
    expect(SMSHelper.parts('S'.repeat(158) + '|')).to.equal(1)
    expect(SMSHelper.parts('S'.repeat(159) + '|')).to.equal(2)
    expect(SMSHelper.parts('S'.repeat(152) + '|' + 'S'.repeat(152))).to.equal(3)
    expect(SMSHelper.parts('S'.repeat(152) + '|' + 'S'.repeat(150) + '|')).to.equal(3)
    expect(SMSHelper.parts('S'.repeat(152) + '|' + 'S'.repeat(150) + '|' + 'S'.repeat(150) + '|')).to.equal(4)
  });
})
