import * as undox_action from "./undox.action"
// @ponicode
describe("undox_action.redo", () => {
    test("0", () => {
        let callFunction: any = () => {
            undox_action.redo(-100)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            undox_action.redo(100)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            undox_action.redo(1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            undox_action.redo(-5.48)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            undox_action.redo(NaN)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("undox_action.group", () => {
    test("0", () => {
        let callFunction: any = () => {
            undox_action.group([undefined, undefined, undefined, undefined, undefined])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            undox_action.group([undefined, undefined, undefined, undefined])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            undox_action.group([undefined, undefined, undefined])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            undox_action.group([undefined])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            undox_action.group([undefined, undefined])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            undox_action.group([])
        }
    
        expect(callFunction).not.toThrow()
    })
})
