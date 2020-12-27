export const architectures = [
    {
        id: 1,
        paper: "Paper 1",
        components: [
            {
                id: 1,
                name: "Blockchain",
                properties: [
                    {
                        id: 1,
                        key: "name", 
                        value: "Ethereum"
                    },
                    {
                        id: 2,
                        key: "consensusAlgorithm", 
                        value: "PoA"
                    }
                ]
            },
            {
                id: 2, 
                name: "API",
                properties: [
                    {
                        id: 3,
                        key: "language", 
                        value: "Node.JS"
                    }
                ]
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
                properties: [
                    {
                        id: 4,
                        key: "name", 
                        value: "Ethereum"
                    },
                    {
                        id: 5,
                        key: "consensusAlgorithm", 
                        value: "PoS"
                    }
                ]
            },
            {
                id: 4, 
                name: "Front",
                properties: [
                    {
                        id: 6,
                        key: "language", 
                        value: "React"
                    }
                ]
            }
        ],
        desc: "This is the architecture for paper 2",
        doneBy: 2
    }
]