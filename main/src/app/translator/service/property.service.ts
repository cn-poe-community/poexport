import { PropertyProvider } from "../provider/property.provider";
import { ZH_PROPERTY_NAME_LIMITED_TO } from "../type/property.type";

const HISTORIC = "Historic";
const ZH_HISTORIC = "史实";

export class PropertyService {
    private readonly propertyProvider: PropertyProvider;

    constructor(propertyProvider: PropertyProvider) {
        this.propertyProvider = propertyProvider;
    }

    public translateName(zhName: string): string | null {
        const names = this.propertyProvider.provideNames();
        const name = names.get(zhName);

        return name ? name : null;
    }

    public translateValue(zhName: string, zhValue: string): string | null {
        if (zhName === ZH_PROPERTY_NAME_LIMITED_TO) {
            return zhValue.replace(ZH_HISTORIC, HISTORIC);
        }

        const values = this.propertyProvider.provideValues();
        const value = values.get(zhValue);

        return value ? value : null;
    }
}