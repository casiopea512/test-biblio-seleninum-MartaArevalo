const { BaseTest } = require("./BaseTest.js");
const { By, until } = require("selenium-webdriver");
const assert = require("assert");
require("dotenv").config();

class MyTest extends BaseTest {
    async test() {
        try {
            var site = process.env.URLLOGIN;
            await this.driver.get(site + "/admin/login");

            // Buscar los campos de usuario y contraseña
            let inputUserName = await this.driver.wait(until.elementLocated(By.id("id_username")), 10000);
            let inputUserPassword = await this.driver.wait(until.elementLocated(By.id("id_password")), 10000);

            inputUserName.sendKeys(process.env.USUARI);
            inputUserPassword.sendKeys(process.env.CONTRASENYA);

            // Hacer clic en el botón de login
            let submitButton = await this.driver.wait(until.elementLocated(By.css("input[value='Iniciar sessió']")), 10000);
            submitButton.click();

            // Verificar login
            let logoutButton = await this.driver.wait(until.elementLocated(By.xpath('//button[@type="submit"]')), 10000);
            var currentLogoutText = await logoutButton.getText();
            var expectedText = "FINALITZAR SESSIÓ";

            if (currentLogoutText !== expectedText) {
                throw new Error(`ERROR: Logout Button incorrecto. Encontrado: "${currentLogoutText}", Esperado: "${expectedText}". No se ha conseguido iniciar sesión`);
            }

            console.log("Login verificado correctamente.");

            // Navegar a la sección de libros y eliminar el libro
            await this.driver.findElement(By.xpath("//a[text()='Llibres']")).click();
            await this.driver.findElement(By.xpath("//a[text()='"+process.env.BOOKTITLE+"']")).click();
            await this.driver.findElement(By.xpath("//a[contains(@class, 'deletelink')]")).click();
            await this.driver.findElement(By.xpath("//input[@type='submit']")).click();

            // Verificar que el libro ha sido eliminado
            let bookList = await this.driver.findElements(By.xpath("//a[text()='"+process.env.BOOKTITLE+"']"));
            if (bookList.length > 0) {
                throw new Error(`ERROR: El libro "${process.env.BOOKTITLE}" no se eliminó correctamente.`);
            }

            console.log("Libro eliminado correctamente.");
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