// carreguem les llibreries
const { BaseTest } = require("./BaseTest.js")
const { By, until } = require("selenium-webdriver");
const assert = require('assert');

// .env
require('dotenv').config();
console.log(process.env); // aquí hay todas las variables de entorno

// heredem una classe amb un sol mètode test()
// emprem this.driver per utilitzar Selenium

class MyTest extends BaseTest
{
	async test() {
        // Loging test
        var site = process.env.urlLogin;
        await this.driver.get(site+"/admin/login");        

        // cercar loging box
        let inputUserName = await this.driver.wait(until.elementLocated(By.id("id_username")),10000);
        let inputUserPassword = await this.driver.wait(until.elementLocated(By.id("id_password")),10000);

        // posar usuari i pass
        inputUserName.sendKeys(process.env.USUARI);
        inputUserPassword.sendKeys(process.env.CONTRASENYA);

        // boto send -click()
        let submitButton = await this.driver.wait(until.elementLocated(By.css("input[value='Iniciar sessió']")),10000);
        submitButton.click();

        // saber si te has logueado o no
        let logoutButton = await this.driver.wait(until.elementLocated(By.xpath('//button[@type="submit"]')), 10000);
        var currentLogoutText = await logoutButton.getText();
        var expectedText = "FINALITZAR SESSIÓ";
        assert( currentLogoutText==expectedText, "Login fallit.\n\tTEXT TROBAT="+currentLogoutText+"\n\tTEXT ESPERAT="+expectedText);
 
        console.log("TEST OK");
	}
}

// executem el test

(async function test_example() {
	const test = new MyTest();
	await test.run();
	console.log("END")
})();