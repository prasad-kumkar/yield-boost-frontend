import * as React from "react";
import axios from "axios";
import { getAddress, getABI, getContract } from "../../src/contract";
import { ADDRESS_ZERO, WETH_ADDRESS, defaultChain } from '../../src/const';
import { ethers } from "ethers";
import { useEffect } from 'react';
import { useAccount, useNetwork } from "wagmi";
import { Status, SubStatus } from "../utils/status";
import { LendingEndpoints, query_lending } from "../../src/queries/lending";
import useUpdateData from "../utils/useUpdateData";

interface LendingDataValue {
	status: Status;
	message: string;
	markets: any[];
	protocol: any;
	toggleIsCollateral: (marketId: string) => void;
	fetchData: (address?: string) => Promise<number>;
	pools: any[],
	selectedPool: number, 
	setSelectedPool: (index: number) => void;
	protocols: any[],
	positions: any[],
	updatePositions: () => void;
	setUserEMode: (eMode: string) => void;
}

const LendingDataContext = React.createContext<LendingDataValue>({} as LendingDataValue);

function LendingDataProvider({ children }: any) {
	const [status, setStatus] = React.useState<Status>(Status.NOT_FETCHING);
	const [subStatus, setSubStatus] = React.useState<SubStatus>(SubStatus.NOT_SUBSCRIBED);
	const [message, setMessage] = React.useState<LendingDataValue['message']>("");
	const { chain } = useNetwork();
	const { address } = useAccount();
	const [pools, setPools] = React.useState<any[]>([[]]);
	const [protocols, setProtocols] = React.useState<any[]>([{}]);
	const [selectedPool, setSelectedPool] = React.useState<any>(0);
	const markets = pools[selectedPool];
	const protocol = protocols[selectedPool];
	const [positions, setPositions] = React.useState<any[]>([[]]);

	useEffect(() => {
		if(localStorage){
			const _lendingPool = localStorage.getItem("lendingPool");
			if(_lendingPool && pools.length > parseInt(_lendingPool)){
				setSelectedPool(parseInt(_lendingPool));
			}
		}
	}, [selectedPool, pools])

	const fetchData = (_address?: string): Promise<number> => {
		let chainId = defaultChain.id;
		if(chain?.unsupported) chainId = defaultChain.id;
		console.log("Fetching lending data for chain", chainId);
		return new Promise((resolve, reject) => {
			setStatus(Status.FETCHING);
			if(!_address) _address = ADDRESS_ZERO;
			Promise.all(
				LendingEndpoints(chainId).map((endpoint) => {
					return axios.post(endpoint, {
						query: query_lending(_address!.toLowerCase()),
						variables: {},
					})
				}))
			.then(async (res) => {
				console.log(res);
				if (res[0].data.errors || res[1]?.data?.errors) {
					setStatus(Status.ERROR);
					setMessage("Network Error. Please refresh the page or try again later.");
					reject(res[0].data.errors || res[1].data.errors);
				} else {
					let _protocols = [];
					let _pools = [];

					for(let i in res){
						let data = res[i].data.data;
						_protocols.push(data.lendingProtocols[0]);
						_pools.push(data.markets);
						let emodes = [];
						for(let j in data.emodeCategories){
							let emode = data.emodeCategories[j];
							emode.assets = data.markets.filter((market: any) => market.eModeCategory?.id == emode.id);
							emodes.push(emode);
						}
						_protocols[i].eModes = emodes;
						if(_address && (data.account)){
							const _enabledCollaterals = res[i].data.data.account._enabledCollaterals.map((c: any) => c.id);
							_pools[i].forEach((market: any) => {
								market.isCollateral = _enabledCollaterals.includes(market.id);
							})
							_protocols[i].eModeCategory = _protocols[i].eModes.find((emode: any) => emode.id == data.account.eModeCategory?.id);
						}
					}
					console.log("Fetched lending data", _protocols, _pools);
					setProtocols(_protocols);
					setPools(_pools);
					setStatus(Status.SUCCESS);
					resolve(0);
				}
			})
			.catch((err) => {
				console.log(err);
				setStatus(Status.ERROR);
				setMessage(
					"Failed to fetch data. Please refresh the page and try again later."
				);
			});
		});
	};

	React.useEffect(() => {
        if(subStatus == SubStatus.NOT_SUBSCRIBED && pools[0].length > 1 && protocols[0]?.id && address) {
			setSubStatus(SubStatus.SUBSCRIBED);
			console.log("Subscribed to lending data");
			updatePositions(address);
			setInterval(updatePositions, 30000);
        }
    }, [pools, address, subStatus, protocols]);

	const updatePositions = async (_address = address) => {
		if(!_address) return;
		const chainId = defaultChain.id;
		const provider = new ethers.providers.JsonRpcProvider(defaultChain.rpcUrls.default.http[0]);
		const helper = new ethers.Contract(
			getAddress("Multicall2", chainId),
			getABI("Multicall2", chainId),
			provider
		);
		let calls = [];
		for(let i in pools){
			if(!protocols[i]._lendingPoolAddress) continue;
			const _pool = await getContract("LendingPool", chainId, protocols[i]._lendingPoolAddress);
			calls.push([_pool.address, _pool.interface.encodeFunctionData("getUserAccountData", [_address])]);
		}
		console.log(calls);
		helper.callStatic.aggregate(calls)
		.then(async (res: any) => {
			console.log(res);
			let resultData = res[1];
			let _positions = [];
			for(let i = 0; i < resultData.length; i++){
				const _pool = await getContract("LendingPool", chainId, protocols[i]._lendingPoolAddress);
				const _marketDataDecoded = _pool.interface.decodeFunctionResult("getUserAccountData", resultData[i]);
				_positions.push({
					totalCollateralBase: _marketDataDecoded[0].toString(),
					totalDebtBase: _marketDataDecoded[1].toString(),
					availableBorrowsBase: _marketDataDecoded[2].toString(),
					currentLiquidationThreshold: _marketDataDecoded[3].toString(),
					ltv: _marketDataDecoded[4].toString(),
					healthFactor: _marketDataDecoded[5].toString(),
				});
			}
			setPositions([{
				totalCollateralBase: "0",
				totalDebtBase: "0",
				availableBorrowsBase: "0",
				currentLiquidationThreshold: "0",
				ltv: "0",
				healthFactor: "0",
			}]);
		})
		.catch((err: any) => {
			console.log("Failed to get lending positions", err);
			setPositions([[]])
		})
	}


	const toggleIsCollateral = (marketId: string) => {
		let _pools = [...pools]
		for(let i in _pools){
			const _markets = _pools[i].map((market: any) => {
				if (market.id == marketId) {
					market.isCollateral = !(market.isCollateral ?? false);
				}
				return market;
			});
			_pools[i] = _markets
		}

		setPools(_pools);
	}

	const setUserEMode = (emode: string) => {
		let newProtocol = {...protocol};
		newProtocol.eModeCategory = newProtocol.eModes.find((eMode: any) => eMode.id == emode);
		let newProtocols = [...protocols];
		newProtocols[selectedPool] = newProtocol;
		setProtocols(newProtocols);
	}

	const value: LendingDataValue = {
		status,
		message,
		markets,
		protocol,
		toggleIsCollateral,
		fetchData,
		selectedPool,
		setSelectedPool,
		pools,
		protocols,
		positions,
		updatePositions,
		setUserEMode
	};

	return (
		<LendingDataContext.Provider value={value}>
			{children}
		</LendingDataContext.Provider>
	);
}

export const useLendingData = () => {
	return React.useContext(LendingDataContext);
}

export { LendingDataProvider, LendingDataContext };
