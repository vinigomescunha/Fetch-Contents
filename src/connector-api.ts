import { fetchFrom } from "./fetch-api";

export interface IConnectApis {
    source: Source;
}
export type Source = {
    type: string;
    href: string;
};
export type PrimitiveTransform = {
    fieldName: string;
    fn: string;
};
export class ConnectorApis implements IConnectApis {
    public output: any = {};
    public source: Source;
    public transform: PrimitiveTransform[];
    public data: any;

    private constructor(source: Source, transform: PrimitiveTransform[]) {
        this.source = source;
        this.transform = transform;
    }
    public async build() {
        this.data = await fetchFrom(this.source);
        this.transform.forEach(t => {
            const fn = eval(t.fn);
            this.output[t.fieldName] = (typeof fn === 'function') ? (fn).apply(this, [this.data]) : fn;
        });
        return this.output;
    }
    public static async build(obj: any): Promise<any> {
        try {
            const { source, transform } = obj;
            return await new ConnectorApis(source, transform).build();
        } catch (e) {
            console.log(`Error: ${e.message} on source : ${JSON.stringify(obj.source)}`);
            return null;
        }
    }
}