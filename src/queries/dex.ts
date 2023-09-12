import { lineaTestnet, mantleMainnet, mantleTestnet } from "../chains";

const DEX_ENDPOINTS: any = {
    [mantleTestnet.id]: process.env.NEXT_PUBLIC_GRAPH_DEX_5001,
    [mantleMainnet.id]: process.env.NEXT_PUBLIC_GRAPH_DEX_5000,
    [lineaTestnet.id]: process.env.NEXT_PUBLIC_GRAPH_DEX_59140,
}

const MINICHEF_ENDPOINTS: any = {
    [mantleTestnet.id]: process.env.NEXT_PUBLIC_GRAPH_MINICHEF_5001,
    [mantleMainnet.id]: process.env.NEXT_PUBLIC_GRAPH_MINICHEF_5000,
    [lineaTestnet.id]: process.env.NEXT_PUBLIC_GRAPH_MINICHEF_59140,
}

const ROUTER_ENDPOINTS: any = {
    [mantleTestnet.id]: process.env.NEXT_PUBLIC_GRAPH_ROUTER_5001,
    [mantleMainnet.id]: process.env.NEXT_PUBLIC_GRAPH_ROUTER_5000,
    [lineaTestnet.id]: process.env.NEXT_PUBLIC_GRAPH_ROUTER_59140,
}

export const DEX_ENDPOINT = (chainId: number) => DEX_ENDPOINTS[chainId] ?? (process.env.NEXT_PUBLIC_NETWORK == 'testnet' ? DEX_ENDPOINTS[mantleTestnet.id] : DEX_ENDPOINTS[mantleMainnet.id]);
export const MINICHEF_ENDPOINT = (chainId: number) => MINICHEF_ENDPOINTS[chainId] ?? (process.env.NEXT_PUBLIC_NETWORK == 'testnet' ? MINICHEF_ENDPOINTS[mantleTestnet.id] : MINICHEF_ENDPOINTS[mantleMainnet.id]);
export const ROUTER_ENDPOINT = (chainId: number) => ROUTER_ENDPOINTS[chainId] ?? (process.env.NEXT_PUBLIC_NETWORK == 'testnet' ? ROUTER_ENDPOINTS[mantleTestnet.id] : ROUTER_ENDPOINTS[mantleMainnet.id])

export const query_dex = (address: string) => (`
{
    balancers{
        address
        totalLiquidity
        totalSwapVolume
        totalSwapFee
        pools (where: {isPaused: false}) {
            id
            address
            poolType
            factory
            name
            symbol
            swapFee
            swapEnabled
            isPaused
            totalWeight
            totalLiquidity
            totalSwapVolume
            totalSwapFee
            tokens(orderBy: index) {
                token {
                    id
                    name
                    symbol
                    decimals
                    isPermit
                }
                balance
                weight
                index
            }
            tokensList
            totalShares
            snapshots(first:7, orderBy: timestamp, orderDirection: desc){
              swapVolume
              swapFees
              timestamp
            }
        }
    }
  }
`);


export const query_leaderboard = (address: string) => (`
{
    epoches{
      id
      totalVolumeUSD
      userCount
      totalPoints
      merkleRoot
      rewardsContract
      users(first: 49, orderBy: totalPoints, orderDirection: desc){
          id
          address
          totalPoints
          totalVolumeUSD
      }
      startAt
      endAt
    }
    epochUsers(where: {address_in: ["${address}"]}) {
      epoch{
        id
      }
      address
      totalPoints
      totalVolumeUSD
    }
  }`)


export const query_minichef = (address: string) => (`
{
    miniChefs{
        id
        totalAllocPoint
        sushiPerSecond
        pools{
            id
            pair
            allocPoint
            accSushiPerShare
            slpBalance
        }
    }
    users(where: {address: "${address.toLowerCase()}"}){
        id
        address
        amount
        rewardDebt
        sushiHarvested
    }
}`)