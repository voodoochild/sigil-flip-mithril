;(() => {
    "use strict";

    const m = require("mithril"),
        util = require("./util"),
        Collection = require("./collection"),
        GW2_API = "https://api.guildwars2.com/v2",
        TICK = 60000;

    let Weapons = new Collection(require("./weapons.json"), [ "id" ]),
        Sigils = new Collection(require("./sigils.json"), [ "id", "name" ]),
        ids = []
            .concat(Weapons.keys("id"), Sigils.keys("id"))
            .filter(id => id > 0);

    // Grab item details
    function getItemDetails() {
        util.batchRequest(`${GW2_API}/items`, ids)
            .then(items => {
                items.forEach(item => {
                    let thing = Weapons.item("id", item.id) ||
                                Sigils.item("id", item.id);

                    thing.icon = item.icon;
                });
                m.redraw();
            });
    }

    getItemDetails();

    // Grab prices
    function getItemPrices() {
        util.batchRequest(`${GW2_API}/commerce/prices`, ids)
            .then(prices => {
                prices.forEach(item => {
                    let thing = Weapons.item("id", item.id) ||
                                Sigils.item("id", item.id);
                    
                    thing.buyPrice = item.buys.unit_price;
                    thing.sellPrice = item.sells.unit_price;
                });
                m.redraw();
            });
    }

    getItemPrices();

    // Render the UI
    let SigilFlip = {
        controller : function() {
            this.interval = null;
            this.start = () => this.interval = setInterval(getItemPrices, TICK);
            this.stop = () => clearInterval(this.interval);
            this.start();
        },

        view : function() {
            return m("ul.items", Weapons.items.filter(weapon => weapon.id > 0).map(weapon => {
                let sigil = Sigils.item("name", weapon.sigil),
                    profit;

                if(weapon.buyPrice && sigil.sellPrice) {
                    profit = util.flip(weapon.buyPrice, sigil.sellPrice);
                }

                return m(profit > 0 ? "li.profitable" : "li", [
                    m("a", { href : `http://www.gw2spidy.com/item/${weapon.id}` }, [
                        weapon.icon ? m("img.icon", { src : weapon.icon }) : "",
                        m("span", `${weapon.name}: `),
                        weapon.buyPrice ? m("span", `${util.formatPrice(weapon.buyPrice)}`) : ""
                    ]),
                    m("a", { href : `http://www.gw2spidy.com/item/${sigil.id}` }, [
                        sigil.icon ? m("img.icon", { src : sigil.icon }) : "",
                        m("span", `${sigil.name}: `),
                        sigil.sellPrice ? m("span", `${util.formatPrice(sigil.sellPrice)}`) : ""
                    ]),
                    profit ? m("p", "Profit: ", [
                        m(profit > 0 ? "span.positive" : "span.negative", `${util.formatPrice(profit)}`)
                    ]) : ""
            ]);
            }));
        }
    };

    m.module(document.getElementById("app"), SigilFlip);
})();
