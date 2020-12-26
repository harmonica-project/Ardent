export const architectures = [
    {
        id: 1,
        paper: "Paper 1",
        components: [
            {
                id: 1,
                name: "Blockchain",
                properties: {
                    name: "Ethereum",
                    consensusAlgorithm: "PoA"
                }
            },
            {
                id: 2, 
                name: "API",
                properties: {
                    language: "Node.js"
                }
            }
        ],
        desc: "This is the architecture for paper 1",
        doneBy: 1
    },
    {
        id: 2,
        paper: "Paper 2",
        components: [
            {
                id: 3,
                name: "Blockchain",
                properties: {
                    name: "Ethereum",
                    consensusAlgorithm: "PoS"
                }
            },
            {
                id: 4, 
                name: "Front",
                properties: {
                    "language": "React"
                }
            }
        ],
        desc: "This is the architecture for paper 2",
        doneBy: 2
    }
]