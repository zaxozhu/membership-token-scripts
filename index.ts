import { Connection, NodeWallet } from "@metaplex/js";
import { Keypair, Transaction } from "@solana/web3.js";
import { createCreateStoreInstruction } from "@metaplex-foundation/mpl-membership-token";

const payer = Keypair.fromSecretKey(
  new Uint8Array([
    225, 60, 117, 68, 123, 252, 1, 200, 41, 251, 54, 121, 6, 167, 204, 18, 140, 168, 206, 74, 254, 156, 230, 10, 212, 124, 162, 85, 120, 78, 122, 106, 187, 209, 148, 182, 34, 149, 175, 173, 192, 85, 175, 252, 231, 130, 76, 40, 175, 177, 44, 111, 250,
    168, 3, 236, 149, 34, 236, 19, 46, 9, 66, 138,
  ])
);
const connection = new Connection("devnet");
// Wallet
const wallet = new NodeWallet(payer);

const run = async () => {
  const store = Keypair.generate();

  const instruction = createCreateStoreInstruction(
    {
      store: store.publicKey,
      admin: payer.publicKey,
    },
    {
      name: "izd5Pr9ltIAJL4ac8cYMUDlakSXNPnJPfR9awYq2",
      description: "HBtoUA5sTkPZRo5dkkP01WgFX4A6yPflFRtG3nZOAaWZ7Pipe3xIgvBRdLTY",
    }
  );

  const transaction = new Transaction();
  transaction.add(instruction);
  transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
  transaction.feePayer = payer.publicKey;
  transaction.partialSign(store);

  const signedTx = await wallet.signTransaction(transaction);
  let txId;
  try {
    txId = await connection.sendRawTransaction(signedTx.serialize(), { skipPreflight: true });
  } catch {}
  console.log(txId);
};

run();
