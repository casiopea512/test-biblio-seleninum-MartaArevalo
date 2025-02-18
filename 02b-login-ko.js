const { BaseTest } = require("./BaseTest.js")
const { By, until } = require("selenium-webdriver");
const assert = require('assert');
require('dotenv').config();

class MyTest extends BaseTest {
    async test() {
        var site = process.env.URLLOGIN;
        await this.driver.get(site + "/admin/login");

        // Buscar los campos de usuario y contraseña
        let inputUserName = await this.driver.wait(until.elementLocated(By.id("id_username")), 10000);
        let inputUserPassword = await this.driver.wait(until.elementLocated(By.id("id_password")), 10000);

        // Ingresar credenciales incorrectas
        inputUserName.sendKeys('usuariIncorrecte');
        inputUserPassword.sendKeys('contrasenyaIncorrecta');

        // Hacer clic en el botón de login
        let submitButton = await this.driver.wait(until.elementLocated(By.css("input[value='Iniciar sessió']")), 10000);
        submitButton.click();

        try {
            // Esperar mensaje de error de login
            let errorMessage = await this.driver.wait(
                until.elementLocated(By.css(".errornote")), 5000
            );
            let errorText = await errorMessage.getText();

            console.log("TEST OK - Mensaje del incorrecto detectado: " + errorText);
        } catch (error) {
            assert.fail("TEST FALLIDO - No se encontró mensaje de error de login");
        }
    }
}

// Ejecutar el test
(async function test_example() {
    const test = new MyTest();
    await test.run();
    console.log("END");
})();