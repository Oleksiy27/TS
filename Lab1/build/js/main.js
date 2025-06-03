"use strict";
function triangle(value1 = 0, type1 = "", value2 = 0, type2 = "") {
    if (type1 === "" || type2 === "") {
        console.log("Введіть правильну кількість параметрів трикутника та їх значень.");
        return "failed";
    }
    if (typeof value1 != 'number' || typeof value2 != 'number') {
        console.log("Значення параметрів трикутника повинні бути задані числом");
        return "failed";
    }
    const validTypes = ["leg", "hypotenuse", "adjacent angle", "opposite angle", "angle"];
    if (!validTypes.includes(type1) || !validTypes.includes(type2)) {
        console.log("Будь ласка, перечитайте інструкцію та введіть правильні параметри трикутника.");
        return "failed";
    }
    if (type1 === type2 && type1 != "leg") {
        console.log("Ви ввели несумісну пару параметрів трикутника.");
        return "failed";
    }
    if ((type1 === "angle" && type2 != "hypotenuse") || (type2 === "angle" && type1 != "hypotenuse")) {
        console.log("Ви ввели несумісну пару параметрів трикутника. Якщо кут — один з параметрів, то іншим обовязково повинна бути гіпотенуза.");
        return "failed";
    }
    if ((type1 === "opposite angle" && type2 === "adjacent angle") || (type2 === "opposite angle" && type1 === "adjacent angle")) {
        console.log("Ви ввели несумісну пару параметрів трикутника.");
        return "failed";
    }
    if ((type1 === "adjacent angle" && type2 === "hypotenuse") ||
        (type2 === "adjacent angle" && type1 === "hypotenuse") ||
        (type1 === "opposite angle" && type2 === "hypotenuse") ||
        (type2 === "opposite angle" && type1 === "hypotenuse")) {
        console.log("Ви ввели несумісну пару параметрів трикутника.");
        return "failed";
    }
    if (value1 <= 0 || value2 <= 0) {
        console.log("Значення елементів повинні бути більшими за нуль.");
        return "failed";
    }
    let hypotenuse = 0, leg = 0, otherLeg = 0, alpha = 0, beta = 0;
    if (type1 === "leg" && type2 === "leg") {
        leg = Math.min(value1, value2);
        otherLeg = Math.max(value1, value2);
        hypotenuse = Math.sqrt(leg * leg + otherLeg * otherLeg);
        beta = Math.atan(leg / otherLeg) * (180 / Math.PI);
        alpha = 90 - beta;
    }
    else if (type1 === "leg" || type2 === "leg") {
        if (type1 === "hypotenuse" || type2 === "hypotenuse") {
            leg = (type1 === "leg") ? value1 : value2;
            hypotenuse = (type1 === "hypotenuse") ? value1 : value2;
            if (hypotenuse < leg) {
                console.log("Катет не може бути більшим за гіпотенузу.");
                return "failed";
            }
            else {
                otherLeg = Math.sqrt(hypotenuse * hypotenuse - leg * leg);
                beta = Math.asin(leg / hypotenuse) * (180 / Math.PI);
                alpha = 90 - beta;
            }
        }
        if (type1 === "opposite angle" || type2 === "opposite angle") {
            leg = (type1 === "leg") ? value1 : value2;
            beta = (type1 === "opposite angle") ? value1 : value2;
            hypotenuse = leg / Math.sin(beta * (Math.PI / 180));
            otherLeg = Math.sqrt(hypotenuse * hypotenuse - leg * leg);
            alpha = 90 - beta;
        }
        if (type1 === "adjacent angle" || type2 === "adjacent angle") {
            leg = (type1 === "leg") ? value1 : value2;
            alpha = (type1 === "adjacent angle") ? value1 : value2;
            otherLeg = leg * Math.tan(alpha * (Math.PI / 180));
            hypotenuse = leg / Math.cos(alpha * (Math.PI / 180));
            beta = 90 - alpha;
        }
    }
    else if ((type1 === "hypotenuse" && type2 === "angle") || (type1 === "angle" && type2 === "hypotenuse")) {
        hypotenuse = (type1 === "hypotenuse") ? value1 : value2;
        alpha = (type1 === "angle") ? value1 : value2;
        leg = hypotenuse * Math.cos(alpha * (Math.PI / 180));
        otherLeg = hypotenuse * Math.sin(alpha * (Math.PI / 180));
        beta = 90 - alpha;
    }
    if (beta > 90 || alpha > 90) {
        console.log("У прямокутному трикутнику не може бути тупого кута.");
        return "failed";
    }
    if (beta == 90 || alpha == 90) {
        console.log("У прямокутному трикутнику не може бути двох прямих кутів.");
        return "failed";
    }
    console.log(`a = ${leg}\nb = ${otherLeg}\nc = ${hypotenuse}\nalpha = ${alpha}°\nbeta = ${beta}°`);
    return "success";
}
console.log("\tІНСТРУКЦІЯ");
console.log("Ця програма обчислює всі сторони та кути прямокутного трикутника.");
console.log('Використовуйте команду: triangle(значення1, "параметр1", значення2, "параметр2")');
console.log("Один кут вже відомий — 90°, тож потрібно ввести ще два параметри.");
console.log("Доступні параметри:");
console.log('\t• "leg" — катет');
console.log('\t• "hypotenuse" — гіпотенуза');
console.log('\t• "adjacent angle" — кут, прилеглий до катета');
console.log('\t• "opposite angle" — кут, протилежний до катета');
console.log('\t• "angle" — будь-який гострий кут (зазвичай із гіпотенузою)');
console.log("");
console.log('Приклад: triangle(13, "leg", 25, "opposite angle")');
console.log("⚠ Вказуйте сумісні параметри: два кути — недостатньо, гіпотенуза з кутом — некоректно без катета.");
