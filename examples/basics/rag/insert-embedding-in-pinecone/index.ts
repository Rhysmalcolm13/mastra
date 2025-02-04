import { MDocument, embed, PineconeVector } from '@mastra/rag';

const doc = MDocument.fromText('Your text content...');

const chunks = await doc.chunk();

const { embeddings } = await embed(chunks, {
  provider: 'OPEN_AI',
  model: 'text-embedding-ada-002',
  maxRetries: 3,
});

const pinecone = new PineconeVector(process.env.PINECONE_API_KEY!);

await pinecone.createIndex('test_index', 1536);

await pinecone.upsert(
  'test_index',
  embeddings,
  chunks?.map(chunk => ({ text: chunk.text })),
);
