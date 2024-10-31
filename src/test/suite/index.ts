import * as glob from "glob";
import Mocha from "mocha";
import * as path from "path";

export async function run(): Promise<void> {
  const mocha = new Mocha({
    ui: "tdd",
    color: true,
  });

  const testsRoot = path.resolve(__dirname, "..");

  try {
    const files = await new Promise<string[]>((resolve, reject) => {
      glob.glob("**/*.test.js", { cwd: testsRoot });
    });

			// Add files to the test suite
      files.forEach((file) => mocha.addFile(path.resolve(testsRoot, file)));

    await new Promise<void>((resolve, reject) => {
			// Run the mocha test
      mocha.run((failures) => {
        if (failures > 0) {
          reject(new Error(`${failures} tests failed.`));
        } else {
          resolve();
        }
      });
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Test runner failed: ${error.message}`);
    }
  }
}
