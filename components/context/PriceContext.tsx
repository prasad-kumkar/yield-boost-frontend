import Big from "big.js";
import { BigNumber, ethers } from "ethers";
import * as React from "react";
import { getABI, getAddress, getContract } from "../../src/contract";
import { useAccount, useNetwork } from "wagmi";
import { ADDRESS_ZERO, PYTH_ENDPOINT, REPLACED_FEEDS, WETH_ADDRESS, defaultChain } from "../../src/const";
import { useLendingData } from "./LendingDataProvider";
import { useAppData } from "./AppDataProvider";
import { Status, SubStatus } from "../utils/status";
import axios from 'axios';

const PriceContext = React.createContext<PriceValue>({} as PriceValue);

interface PriceValue {
    prices: any;
    status: Status;
}

function PriceContextProvider({ children }: any) {
    const [status, setStatus] = React.useState<Status>(Status.NOT_FETCHING);
	// const [prices, setPrices] = React.useState<any>({});
    const [refresh, setRefresh] = React.useState(0);

	const { chain } = useNetwork();

    const { markets: selectedLendingMarket, pools: lendingPools } = useLendingData();
    const { pools } = useAppData();
    const { address } = useAccount();

    // React.useEffect(() => {
    //     if(status == Status.NOT_FETCHING && pools.length > 0 && selectedLendingMarket.length > 0) {
    //         if(selectedLendingMarket[0].feed && pools[0].synths[0].feed){
    //             updatePrices();
    //         }
    //     }
    // }, [selectedLendingMarket, pools, address, status]);

    const prices = () => {
        let _prices: any = {};
        for (let i in selectedLendingMarket){
            _prices[selectedLendingMarket[i].inputToken.id] = selectedLendingMarket[i].inputTokenPriceUSD;
        }
        _prices["0x5979d7b546e38e414f7e9822514be443a4800529"] = '1780';
        _prices["0xbb33e51bdc598d710ff59fdf523e80ab7c882c83"] = '1820';
        return _prices;
    }


    const value: PriceValue = {
		prices: prices(),
        status
	};
    

	return (
		<PriceContext.Provider value={value}>{children}</PriceContext.Provider>
	);
}


const usePriceData = () => {
    const context = React.useContext(PriceContext);
    if (context === undefined) {
        throw new Error("usePriceData must be used within a PriceProvider");
    }
    return context;
};

export { PriceContextProvider, PriceContext, usePriceData };