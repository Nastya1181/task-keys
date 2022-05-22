import { IItem } from './index';
import { useState, useEffect, ChangeEvent, KeyboardEvent, useRef } from 'react';

interface INote {
    item: IItem;
    isEdit: boolean;
}

export function Keys(props: { initialData: IItem[]; sorting: 'ASC' | 'DESC' }) {
    const initArr: INote[] = [];
    props.initialData.forEach((dataItem) => {
        let itemStatusZip = { item: dataItem, isEdit: false };
        initArr.push(itemStatusZip);
    });

    const [items, setItems] = useState<INote[]>(initArr.sort().reverse());
    const [name, setName] = useState<string>('');
    const nameRef = useRef<string>();

    const startEdit = (id: number) => {
        if (items.find((note) => note.isEdit === true) === undefined) {
            const copy: INote[] = Object.assign([], items);
            let index = copy.findIndex((note) => note.item.id === id);
            copy[index].isEdit = true;
            nameRef.current = copy[index].item.name;
            setName(copy[index].item.name);
            setItems(copy);
        } else console.log('закончите редактировать предыдущий элемент');
    };

    useEffect(() => {
        const copy: INote[] = Object.assign([], items);
        setItems(copy.sort().reverse());
    }, [props.sorting]);

    const endEdit = (id: number, save: boolean) => {
        const copy: INote[] = Object.assign([], items);
        let index = copy.findIndex((note) => note.item.id === id);
        copy[index].isEdit = false;
        if (save) {
            copy[index].item.name = name;
        }
        setItems(copy);
    };

    let result = items.map((note, index) => {
        let elem;

        if (!note.isEdit) {
            elem = (
                <span
                    id={note.item.id.toString()}
                    onClick={() => startEdit(note.item.id)}
                >
                    {note.item.name}
                </span>
            );
        } else {
            elem = (
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            endEdit(note.item.id, true);
                        } else if (event.key === 'Escape') {
                            event.currentTarget.value =
                                nameRef.current as string;
                            endEdit(note.item.id, false);
                        }
                    }}
                />
            );
        }
        return <li key={note.item.id}>{elem}</li>;
    });
    return (
        <div>
            <ol>{result}</ol>
        </div>
    );
}
