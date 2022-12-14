import {
    describe,
    test,
    expect,
} from '@jest/globals';
import Routes from '../../src/routes';

describe("#Routes test suite", () => {
    const defaultParams = {
        request: {
            headers: {
                "Content-type": "multipart/form-data",
            },
            method: "",
            body: {}
        },
        reponse: {
            setHeader: jest.fn(),
            writeHead: jest.fn(),
            end: jest.fn(),
        },
        values: () => Object.values(defaultParams)
    }
    
    describe("#setSocketInstance", () => {
        test("setSocket should store io instance", () => {
            const routes = new Routes();
            const ioObj = {
                to: (id) => ioObj,
                emit: (event, message) => {},
            }
            routes.setSocketInstance(ioObj);
            expect(routes.io).toStrictEqual(ioObj);
        })
    })

    describe("#handler", () => {

        test("given an inexistent route it should choose default route", async () => {
            const routes = new Routes()
            const params = {
                ...defaultParams,
            }

            params.request.method = "inexistent"
            await routes.handler(...params.values())
            expect(params.reponse.end).toHaveBeenCalledWith("Hello World")
        })

        test("it should set any request with CORS enabled", async () => {
            const routes = new Routes()
            const params = {
                ...defaultParams,
            }

            params.request.method = "inexistent"
            await routes.handler(...params.values())
            expect(params.reponse.setHeader)
                .toHaveBeenCalledWith("Access-Control-Allow-Origin", "*")
        })

        test("given method OPTIONS it should choose options route", async () => {
            const routes = new Routes()
            const params = {
                ...defaultParams,
            }

            params.request.method = "OPTIONS"
            await routes.handler(...params.values())
            expect(params.reponse.writeHead).toHaveBeenCalledWith(204)
            expect(params.reponse.end).toHaveBeenCalled()
        })

        test("given method POST it should choose post route", async () => {
            const routes = new Routes()
            const params = {
                ...defaultParams,
            }
            jest.spyOn(routes, routes.post.name).mockResolvedValue()

            params.request.method = "POST"
            await routes.handler(...params.values())
            expect(routes.post).toHaveBeenCalled()
        })

        test("given method GET it should choose get route", async  () => {
            const routes = new Routes()
            const params = {
                ...defaultParams,
            }

            jest.spyOn(routes, routes.get.name).mockResolvedValue()

            params.request.method = "GET"
            await routes.handler(...params.values())
            expect(routes.get).toHaveBeenCalled()
        })
        
    })

    describe("#get", () => {
        test("given method GET it should list all files downloaded", async () => {
            const routes = new Routes()
            const params = {
                ...defaultParams,
            }            
            
            const filesStatusesMock = [
                {        
                    size: "188 kB",
                    birthtime: "2022-08-30T11:26:08.455Z",
                    owner: "myltiane",  
                    file: 'file.png'
                }
            ]
            jest.spyOn(routes.fileHelper, routes.fileHelper.getFilesStatus.name)
                .mockResolvedValue(filesStatusesMock)

            params.request.method = "GET"
            await routes.handler(...params.values())

            expect(params.reponse.writeHead).toHaveBeenCalledWith(200);
            expect(params.reponse.end).toHaveBeenCalledWith(JSON.stringify(filesStatusesMock));
        })
        
    })
})

