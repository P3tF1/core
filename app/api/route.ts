// app/api/wallet/route.ts
import { NextRequest, NextResponse } from 'next/server'
import TokenABI from "@/contract_abis/p3tf1_coin_abi.json";
import TokenAddress from "@/contract_address/p3tf1_coin_address.json";
import { ethers } from "ethers";

const RPC_URL = "https://sepolia.base.org";

// Type for the expected request body
type WalletRequest = {
  address: string
  points: number
}

// Type for the response
type WalletResponse = {
  success: boolean
  message: string
  data?: {
    address: string
    points: number
  }
  error?: string
}


export async function POST(
  request: NextRequest
): Promise<NextResponse<WalletResponse>> {
  try {
    // Parse the JSON body
    const body: WalletRequest = await request.json()
    const { address, points } = body

    // Validate required fields
    if (!address) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing wallet address',
          error: 'Wallet address is required'
        },
        { status: 400 }
      )
    }

    if (points === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing points value',
          error: 'Points value is required'
        },
        { status: 400 }
      )
    }

    console.log('Processing wallet address:', address)
    console.log('Processing points:', points)

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contract = new ethers.Contract(TokenAddress.address, TokenABI, signer);

    console.log(process.env.PRIVATE_KEY);
    console.log('Contract:', contract);

    const amount = ethers.parseEther(points.toString());
    console.log('Amount:', amount.toString());

    const rewardTx = await contract.transferTokens(address, amount, { gasLimit: 1000000 });
    const rcpt = await rewardTx.wait();
    // console.log('Transaction', rcpt);


    return NextResponse.json({
      success: true,
      message: 'Wallet address and points processed successfully',
      data: {
        address,
        points,
      }
    })

  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: 'Failed to process request'
      },
      { status: 500 }
    )
  }
}