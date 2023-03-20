import "../css/style.css";
import "@ui5/webcomponents/dist/FileUploader.js";
import "@ui5/webcomponents/dist/Button.js";
import "@ui5/webcomponents/dist/TabContainer.js";
import "@ui5/webcomponents/dist/Tab.js";

import convert from "./convert.js";

const fileUploader = document.querySelector("#fp"),
      resultDiv = document.querySelector("#result1"),
      tabContainer = document.querySelector("#tabContainer");

fileUploader.addEventListener("change", event => {
    const oFile = event.target.files[0];

    if (!oFile) {
        resultDiv.innerHTML = "No file selected";
    } else {
        resultDiv.innerHTML = "";
        oFile.text().then(sContent => {
            let oJSON;
            try {
                oJSON = JSON.parse(sContent);
            } catch (e) {

            }
            if (oJSON) {
                let oProcessed = convert.toSVG(oJSON),
                    a = [];

                oProcessed.aCanvas.forEach((oCanvas, i) => {
                    a.push(`<ui5-tab text="${oCanvas.title}" ${i === 0 ? "selected" : ""}>
                      <div id="result${i}" class="result${oCanvas.big ? " big" : ""}">${oCanvas.svg}</div>
                    </ui5-tab>`)
                });

                tabContainer.innerHTML = a.join("");
            }
        });
    }
})