let aExcludeLog = [];

let getTransform = (o, bPos = true, bRotate = true, bScale = true) => {
    let s = "";

    if (bScale) {
        s = `scale(${o.scale.x}, ${o.scale.y})`
    }

    if (o.angle && bRotate) {
        let x = o.x,
            y = o.y;

        s += ` rotate(${o.angle},  ${x}, ${y})`;
    }

    if (bPos) {
        s = `translate(${o.x}, ${o.y}) ` + s;
    }

    return s;
};

let getId = o => {
    if (import.meta.env.DEV) {
        return `id="${o.id}" `;
    }
    return "";
};

let getFill = o => {
    if (o.isFill) {
        return 'fill="black"';
    } else {
        return 'fill="transparent" stroke="black"';
    }
}

const convert = {
    PATH: o => {
        let sTranslate = `translate(${o.graphicX}, ${o.graphicY})`;
        return `<path ${getId(o)}d="${o.dPath}" ${getFill(o)} transform="${sTranslate} ${getTransform(o, false, false)}" stroke-width="0.3"/>`;
    },
    RECT: o => {
        return `<rect id="${o.id}" width="${o.width}" height="${o.height}" x="${o.x}" y="${o.y}" ${getFill(o)} transform="${getTransform(o, false, true, false)}" stroke-width="0.3"/>`;
    },
    CIRCLE: o => {
        return `<ellipse ${getId(o)} rx="${o.width / 2}" ry="${o.height / 2}" transform="${getTransform(o, false, true, false)} translate(${o.x + (o.width / 2)}, ${o.y + (o.height / 2)})" ${getFill(o)} stroke-width="0.3"/>`;
    },
    POLYGON: o => {
        return `<polygon ${getId(o)}points="${o.points}" ${getFill(o)} transform="${getTransform(o)}" stroke-width="0.3"/>`;
    },
    LINE: o => {
        return `<line ${getId(o)} x1="${o.x}" y1="${o.y}" x2="${o.x + o.endPoint.x}" y2="${o.y + o.endPoint.y}" stroke="black" transform="${getTransform(o, false)}" stroke-width="0.3"/>`;
    },
    TEXT: o => {
        if (o.charJSONs) {
            return o.charJSONs.map(c => {
                c.x = c.graphicX;
                c.y = c.graphicY;
                return convert.PATH(c);
            }).join("");
        } else {
            // This mode would rather be only for generated files
            let aStyle = [],
                oStyle = o.style;

            if (oStyle.fontFamily) {
                aStyle.push(`font-family: ${oStyle.fontFamily}`);
            }
            if (oStyle.fontSize) { // 0.359 is a magic number which seems to bring the scale just right
                aStyle.push(`font-size: ${oStyle.fontSize * 0.2818}pt`);
            }
            return `<text ${getId(o)} transform="${getTransform(o, false)}" dominant-baseline="mathematical" x="${o.x}" y="${o.y}" style="${aStyle.join(";")}">${o.text}</text>`;
        }
    },
    PEN: o => {
        let a = [];

        o.points.forEach((c, i) => {
            if (i === 0) {
                a.push(`M ${c.x} ${c.y}`);
                return;
            }
            let aCp = o.controlPoints[i];
            if (aCp) {
                a.push(`S ${aCp[0].x} ${aCp[0].y} ${c.x} ${c.y}`);
            } else {
                let aPrev = o.controlPoints[i - 1];
                if (aPrev) {
                    a.push(`Q ${aPrev[1].x} ${aPrev[1].y} ${c.x} ${c.y}`);
                } else {
                    a.push(`L ${c.x} ${c.y}`);
                }
            }
        });

        let oLast = o.controlPoints[o.points.length - 1];
        if (oLast) {
            a.push(`Q ${oLast[1].x} ${oLast[1].y} ${o.points[0].x} ${o.points[0].y}`);
        }

        return `<path ${getId(o)}d="${a.join(' ')}" ${getFill(o)} transform="${getTransform(o, false)}" stroke-width="0.3"/>`;
    }
};

let processCanvas = (oJSON, oCanvas) => {
    let aOutput = [],
        bBig = oJSON?.device?.data?.value.find(a => a[0] === oCanvas.id)[1]?.mode === "SUPER_LASER_PLANE";

    // Process displays
    oCanvas.displays.forEach(oDisplay => {
        let fnConvert = convert[oDisplay.type];
        if (fnConvert) {
            aOutput.push(fnConvert(oDisplay));
        } else {
            aExcludeLog.push(oDisplay.type);
        }
    });

    return {
        big: bBig,
        title: oCanvas.title.replace("{panel}", "Canvas "),
        svg: `<svg viewBox="0 0 430 ${bBig ? 930 : 390}" xmlns="http://www.w3.org/2000/svg">
                ${aOutput.join("")}
              </svg>`
    };
}

let toSVG = (oJSON) => {
    return {
        aCanvas: oJSON.canvas.map(processCanvas.bind(this, oJSON)),
        aExcluded: aExcludeLog
    };
};

export default {
    toSVG
}
