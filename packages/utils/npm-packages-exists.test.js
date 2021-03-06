const npmPackagesExists = require("./npm-packages-exists").default;
// console.log('npmPackagesExists: ', npmPackagesExists);

jest.mock("./npm-exists");
jest.mock("./resolve-packages");

const mockResolvePackages = require("./resolve-packages").resolvePackages;

describe("npmPackagesExists", () => {
	test("resolves packages when they are available on the local filesystem", () => {
		npmPackagesExists(["./testpkg"]);
		expect(
			mockResolvePackages.mock.calls[
				mockResolvePackages.mock.calls.length - 1
			][0]
		).toEqual(["./testpkg"]);
	});

	test("throws a TypeError when an npm package name doesn't include the prefix", () => {
		expect(() => npmPackagesExists(["my-webpack-addon"])).toThrowError(
			TypeError
		);
	});

	test("resolves packages when they are available on npm", done => {
		require("./npm-exists").default.mockImplementation(() =>
			Promise.resolve(true)
		);
		npmPackagesExists(["webpack-scaffold-foobar"]);
		setTimeout(() => {
			expect(
				mockResolvePackages.mock.calls[
					mockResolvePackages.mock.calls.length - 1
				][0]
			).toEqual(["webpack-scaffold-foobar"]);
			done();
		}, 10);
	});
});
