import React from "react";
import {render as reactRender} from "react-dom";
import {AppContainer} from "react-hot-loader";
import {ChainConfig} from "bitsharesjs-ws";

// import utils from "./dl_cli_index";
// if (window) {
//     window.$utils = utils;
// }
/*
* Routes-dev is only needed for react hot reload, as this does not work with
* the async routes defined in Routes.jsx. Any changes to the routes must be kept
* synchronized between the two files
*/
import Routes from "./Routes-dev";

ChainConfig.address_prefix = "AGS";
ChainConfig.core_asset = "AGS";
ChainConfig.networks.AEgis = {
    address_prefix: "AGS",
    chain_id: "a1f1444cc2cca678d452e9cdb7daefa4a1b2567a5f0aa09eaa846d759f827e3e"
};

require("./components/Utility/Prototypes"); // Adds a .equals method to Array for use in shouldComponentUpdate

const rootEl = document.getElementById("content");
const render = () => {
    reactRender(
        <AppContainer>
            <Routes />
        </AppContainer>,
        rootEl
    );
};
render();

if (module.hot) {
    module.hot.accept("./Routes-dev.jsx", () => {
        const NextApp = require("./Routes-dev").default;
        reactRender(
            <AppContainer>
                <NextApp />
            </AppContainer>,
            document.getElementById("content")
        );
    });
}
