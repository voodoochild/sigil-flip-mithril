module.exports = {
  /**
   * Break a single large request into multiple smaller requests
   * @param  {String} endpoint
   * @param  {Array} ids
   * @param  {Number} limit
   */
  batchRequest: function (endpoint, ids=[], limit=200) {
    let requests = [];
    let _ids = [].concat(ids);  // Don't change the array that was passed

    while (_ids.length) {
      requests.push(
        fetch(`${endpoint}?ids=${_ids.splice(0, limit)}`)
          .then(response => response.json()));
    }

    return Promise.all(requests)
      .then(responses => {
        return responses.reduce((prev, current) => prev.concat(current), []);
      });
  },

  /**
   * Format a price in gold/silver/copper
   * @param  {Integer} coins
   * @return {String}
   */
  formatPrice: function (coins) {
    let out = [];
    let negative = coins < 0;
    let gold, silver;

    if (negative) {
      coins = coins * -1;
    }

    if (coins >= 10000) {
      gold = parseInt(coins / 10000, 10);
      coins -= gold * 10000;
      out.push(`${gold}g`);
    }

    if (coins >= 100) {
      silver = parseInt(coins / 100, 10);
      coins -= silver * 100;
      out.push(`${silver}s`);
    }

    if (coins) {
      out.push(`${coins}c`);
    }


    return negative ? `-${out.join(' ')}` : out.join(' ');
  },

  /**
   * Calculate the potential profit
   * @param  {Number} buy
   * @param  {Number} sell
   * @return {Number}
   */
  flip: function (buy, sell) {
    if (buy && sell) {
      return Math.floor((sell * 0.9) - (sell * 0.05) - buy);
    }
  }
};
