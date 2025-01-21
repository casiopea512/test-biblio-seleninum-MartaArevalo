// carreguem les llibreries
const { BaseTest } = require("./BaseTest.js")
const { By, until } = require("selenium-webdriver");
const assert = require('assert');

// heredem una classe amb un sol mètode test()
// emprem this.driver per utilitzar Selenium

class MyTest extends BaseTest
{
	async test() {
        // Loging test
        //////////////////////////////////////////////////////
        await this.driver.get("");
        
        // cercar loging box
        let inputUserName = await this.driver.findElement(By.tagName("id_username")).getText();
        let inputUserPassword = await this.driver.findElement(By.tagName("id_password")).getText();

        // posar usuari i pass
        
        // boto send -click()
        let submitButton = await driver.findElement(By.tagName("button")); // O ajusta el selector según tu HTML
        await submitButton.click();

        // ver si entra a la página

        console.log("TEST OK");
	}
}

// executem el test

(async function test_example() {
	const test = new MyTest();
	await test.run();
	console.log("END")
})();