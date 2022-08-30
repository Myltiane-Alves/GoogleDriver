import {
    describe,
    test,
    expect,
    jest
} from "@jest/globals";
import FileHelper from "../../src/fileHelper";
import Routes from "./../../src/routes.js"

describe("#getFileStatus", () => {

    describe("#getFileStatus", () => {
        test("it should return files statuses in correct format", async () => {
            const statMock = {     
                dev: 212247689,
                mode: 33206,
                nlink: 1,
                uid: 0,
                gid: 0,
                rdev: 0,
                blksize: 4096,
                ino: 9570149209144184,
                size: 49264,
                blocks: 104,
                atimeMs: 1661858769254.869,
                mtimeMs: 1661180588207.5383,
                ctimeMs: 1661180588207.5383,
                birthtimeMs: 1661858768455.3264,
                atime: "2022-08-30T11:26:09.255Z",
                mtime: "2022-08-22T15:03:08.208Z",
                ctime: "2022-08-22T15:03:08.208Z",
                birthtime: "2022-08-30T11:26:08.455Z"           
            }
            
            const mockUser = "myltiane"
            process.env.USER = mockUser
            const filename = "file.png"

            jest.spyOn(fs.promises, fs.promises.readdir.name)
                .mockResolvedValue([filename])

            jest.spyOn(fs.promises, fs.promises.stat.name)
                .mockResolvedValue(statMock)

            const result = await FileHelper.getFilesStatus("/tmp")

            const expectedResult = [
                {
                    siqe: "188 kB",
                    lastModifed: statMock.birthtime,
                    owner: mockUser,
                    file: filename
                }
            ]

            expect(fs.promises.stat).toHaveBeenCalledWith(`/tmp/${filename}`)
            expect(result).toMatchObject(expectedResult)
        })
    })
})