const { BaseTest } = require("./BaseTest.js");
const { By, until } = require("selenium-webdriver");
const assert = require("assert");
require("dotenv").config();

class MyTest extends BaseTest {
    async test() {
        try {
            var site = process.env.URLLOGIN;
            await this.driver.get(site + "/admin/login");

            // buscar los campos de usuario y contraseña
            let inputUserName = await this.driver.wait(until.elementLocated(By.id("id_username")), 10000);
            let inputUserPassword = await this.driver.wait(until.elementLocated(By.id("id_password")), 10000);

            inputUserName.sendKeys(process.env.USUARI);
            inputUserPassword.sendKeys(process.env.CONTRASENYA);

            // fer clic en el botón de login
            let submitButton = await this.driver.wait(until.elementLocated(By.css("input[value='Iniciar sessió']")), 10000);
            submitButton.click();

            // verificar login
            try {
                let logoutButton = await this.driver.wait(until.elementLocated(By.xpath('//button[@type="submit"]')), 10000);
                var currentLogoutText = await logoutButton.getText();
                var expectedText = "FINALITZAR SESSIÓ";

                if (currentLogoutText !== expectedText) {
                    throw new Error(`ERROR: Logout Button incorrecte. Trobat: "${currentText}", Esperat: "${expectedText}". No se ha conseguido iniciar sesión`);
                }
            
                console.log("Login verificado correctamente.");
            } catch (error) {
                console.error("ERROR: No se pudo verificar el login - " + error.message);
                assert.fail(error.message);
            }
            
            

            // crear un libro
            console.log("Accediendo a la página de creación de libros...");
            await this.driver.findElement(By.xpath("//a[@href='/admin/biblio/llibre/add/']")).click();

            let inputTitle = await this.driver.wait(until.elementLocated(By.name("titol")), 5000);
            inputTitle.sendKeys(process.env.BOOKTITLE);

            // pulsar en guardar
            let saveButton = await this.driver.wait(until.elementLocated(By.xpath("//input[@value='Desar']")), 5000);
            saveButton.click();

            // ver que se ha creado el libro
            try {
                await this.driver.wait(until.elementLocated(By.xpath("//li[contains(@class, 'success')]")), 10000);
                console.log("Libro creado con éxito.");
            } catch (error) {
                throw new Error("ERROR: No se encontró mensaje de éxito. Puede que la creación haya fallado.");
            }

            console.log("TEST OK");
        } catch (error) {
            console.error("TEST FALLIDO: " + error.message);
            assert.fail(error.message);
        }
    }
}

// Ejecutar el test
(async function test_example() {
    const test = new MyTest();
    await test.run();
    console.log("END");
})();