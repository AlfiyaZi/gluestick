import getHttpClient from "../../src/lib/getHttpClient";
import sinon from "sinon";
import { expect } from "chai";


describe("lib/getHttpClient", () => {
  let axiosMock, mockAxiosInstance;

  beforeEach(() => {
    mockAxiosInstance = {
      interceptors: {
        response: {
          use: (middleware) => {
            mockAxiosInstance.interceptors.response.middleware.push(middleware);
          },
          middleware: [],
        },
        request: {
          use: (middleware) => {
            mockAxiosInstance.interceptors.request.middleware.push(middleware);
          },
          middleware: [],
        }
      },
      config: {
        headers: {}
      },
      get: (fakeResponse) => {
        return {
          request: mockAxiosInstance.interceptors.request.middleware.map(m => m(mockAxiosInstance.config)),
          response: mockAxiosInstance.interceptors.response.middleware.map(m => m(fakeResponse))
        };
      },
      defaults: {
        headers: {
          cookie: ''
        }
      }
    };

    axiosMock = {
      create: sinon.stub().returns(mockAxiosInstance)
    };
  });

  it("should call create with passed params, except headers and modifyInstance", () => {
    const options = {
      headers: {
        "X-Todd": "Hi",
        "test": "best"
      },
      rewriteRequest: [() => {}],
      modifyInstance: c => c,
      abc: 123
    };
    const client = getHttpClient(options, undefined, undefined, axiosMock);
    const { headers, modifyInstance, ...expectedResult } = options;
    expect(axiosMock.create.lastCall.args[0]).to.deep.equal(expectedResult);
  });

  it("should merge request headers if request object is passed", () => {
    const options = {
      headers: {
        "X-Todd": "Hi",
        "test": "best"
      },
      test2: "hi"
    };
    const req = {
      headers: {
        "cookie": "name=Lincoln",
        "host": "hola.com:332211"
      }
    };
    const client = getHttpClient(options, req, {}, axiosMock);
    expect(axiosMock.create.calledWith(options)).to.equal(false);

    const { headers, ...config } = options;
    expect(axiosMock.create.lastCall.args[0]).to.deep.equal({
      baseURL: `http://${req.headers.host}`,
      headers: {
        ...req.headers,
        ...headers
      },
      ...config
    });
  });

  it("should set baseURL with https if req.secure is true", () => {
    const req = {
      headers: {
        "cookie": "name=Lincoln",
        "host": "hola.com:332211"
      },
      secure: true
    };
    const client = getHttpClient({}, req, {}, axiosMock);
    expect(axiosMock.create.lastCall.args[0].baseURL).to.equal(`https://${req.headers.host}`);
  });

  it("should set baseURL with http if req.secure is false", () => {
    const req = {
      headers: {
        "cookie": "name=Lincoln",
        "host": "hola.com:332211"
      },
      secure: false
    };
    const client = getHttpClient({}, req, {}, axiosMock);
    expect(axiosMock.create.lastCall.args[0].baseURL).to.equal(`http://${req.headers.host}`);
  });

  it("should forward along cookies back to the browser", () => {
    const req = {
      headers: {
        "cookie": "name=Lincoln",
        "host": "hola.com:332211"
      },
      secure: false
    };

    const mockServerResponse = {
      removeHeader: sinon.spy(),
      cookie: sinon.spy(),
      append: sinon.spy()
    };

    const client = getHttpClient({}, req, mockServerResponse, axiosMock);
    const { response } = client.get({
      headers: {
        "set-cookie": ["oh=hai"]
      }
    });

    expect(mockServerResponse.append.lastCall.args).to.deep.equal(["Set-Cookie", "oh=hai"]);
  });

  it("should send received cookies in subsequent requests with the same instance", () => {
    const req = {
      headers: {
        "cookie": "name=Lincoln",
        "host": "hola.com:332211"
      },
      secure: false
    };

    const mockServerResponse = {
      removeHeader: sinon.spy(),
      cookie: sinon.spy(),
      append: sinon.spy(),
      headers: {
        "set-cookie": ["_some_cookie=abc", "another_cookie=something"]
      }
    };

    const client = getHttpClient({}, req, mockServerResponse, axiosMock);
    client.get({
      headers: {
        "set-cookie": ["_some_cookie=abc", "another_cookie=something"]
      }
    });
    const { request } = client.get({
      headers: {}
    });

    expect(request[0].headers.cookies).to.equal("_some_cookie=abc; another_cookie=something");
  });

  it("should not send received cookies in subsequent requests with a new instance", () => {
    const req = {
      headers: {
        "cookie": "name=Lincoln",
        "host": "hola.com:332211"
      },
      secure: false
    };

    const mockServerResponse = {
      removeHeader: sinon.spy(),
      cookie: sinon.spy(),
      append: sinon.spy(),
      headers: {
        "set-cookie": ["_some_cookie=abc", "another_cookie=something"]
      }
    };

    const client = getHttpClient({}, req, mockServerResponse, axiosMock);
    client.get({
      headers: {
        "set-cookie": ["_some_cookie=abc", "another_cookie=something"]
      }
    });

    const newClient = getHttpClient({}, req, mockServerResponse, axiosMock);
    const { request } = newClient.get({
      headers: {}
    });

    expect(request[0].headers.cookies).to.equal("_some_cookie=abc; another_cookie=something");
  });

  it("should allow you to modify the axios instance with `modifyInstance`", () => {
    const calledInsideModify = sinon.spy();
    const options = {
      modifyInstance: (client) => {
        calledInsideModify();
        client.modifiedClient = true;
        return client;
      }
    };
    const req = {
      headers: {
        "host": "hola.com:332211"
      },
      secure: false
    };
    const client = getHttpClient(options, req);
    expect(calledInsideModify.called).to.equal(true);
    expect(client.modifiedClient).to.equal(true);
  });
});
