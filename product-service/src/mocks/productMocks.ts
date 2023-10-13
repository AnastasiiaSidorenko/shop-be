import { v4 as uuidv4 } from 'uuid';
import { IProduct } from "src/models/IProduct";

export const productMocks: IProduct[] = [
    {
        id: "1",
        description: 'Description1',
        price: 1000,
        title: 'Pandora',
    },
    {
        id: uuidv4(),
        description: 'Description2',
        price: 1150,
        title: 'Charm',
    },
    {
        id: uuidv4(),
        description: 'Description3',
        price: 2000,
        title: 'Bracelet',
    },
    {
        id: uuidv4(),
        description: 'Description4',
        price: 3000,
        title: 'Necklace',
    },
];