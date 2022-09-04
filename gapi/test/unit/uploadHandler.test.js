import {
    describe,
    test,
    expect,
    jest
} from "@jest/globals";
import UploadHandler from "../../src/uploadHandler";
import TestUtil from "../_util/testUtil";

describe("#UploadHandler test suite", () => {
    const ioObj = {
        to: (id) => ioObj,
        emit: (event, message) => {}
    }

    describe("#registerEvents", () => {
        test("should call onFile and onFinish functions on Busboy instance", () => {
            const uploadHandler = new UploadHandler({
                io: ioObj,
                socketId: "01"
            })

            jest.spyOn(uploadHandler, uploadHandler.onFile.name)
                .mockResolvedValue()
            const headers = {
                'content-type': 'multipart/form-data; boundary='
            }
            const fn = jest.fn()
            const busboyInstance = uploadHandler.registerEvents(headers, fn)

            const filesStream = TestUtil.generateReadableStream(["chunk", "of", "data"])
            busboyInstance.emit("file", "fieldname", filesStream, "filename.txt")

            busboyInstance.listeners("finish")[0].call()

            expect(uploadHandler.onFile).toHaveBeenCalled()
            expect(fn).toHaveBeenCalled()
        })
    })

    describe("#onFile", () => {
        test("given a stream file it should save it on disk", async () => {
            const chunks = ["hey", "dude"]
            const downloadsFolder = "/tmp"
            const handler = new UploadHandler({
                io: ioObj,
                socketId: "01",
                downloadsFolder
            })
        })
    })
})