export namespace config {
	
	export class Config {
	    poeSessId: string;
	
	    static createFrom(source: any = {}) {
	        return new Config(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.poeSessId = source["poeSessId"];
	    }
	}

}

export namespace main {
	
	export class BoolResult {
	    data: boolean;
	    err: string;
	
	    static createFrom(source: any = {}) {
	        return new BoolResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.data = source["data"];
	        this.err = source["err"];
	    }
	}
	export class StringResult {
	    data: string;
	    err: string;
	
	    static createFrom(source: any = {}) {
	        return new StringResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.data = source["data"];
	        this.err = source["err"];
	    }
	}
	export class UpdateInfo {
	    needUpdate: boolean;
	    current: string;
	    latest: string;
	    changelog: string;
	    ok: boolean;
	
	    static createFrom(source: any = {}) {
	        return new UpdateInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.needUpdate = source["needUpdate"];
	        this.current = source["current"];
	        this.latest = source["latest"];
	        this.changelog = source["changelog"];
	        this.ok = source["ok"];
	    }
	}

}

