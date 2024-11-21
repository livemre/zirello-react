// reorder.ts
const reorder = (list: any[], startIndex: number, endIndex: number): any[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

export default reorder;

export const reorderItemsMap = ({
    itemsMap,
    source,
    destination,
}: any) => {
    const current = [...itemsMap[source.droppableId]];
    const next = [...itemsMap[destination.droppableId]];
    const target = current[source.index];

    // Aynı liste içinde taşıma
    if (source.droppableId === destination.droppableId) {
        const reordered = reorder(current, source.index, destination.index);

        // indexInList değerlerini güncelle
        const updatedReordered = reordered.map((item, index) => ({
            ...item,
            indexInList: index,
        }));

        const result = {
            ...itemsMap,
            [source.droppableId]: updatedReordered,
        };

        return {
            quoteMap: result,
        };
    }

    // Farklı listeler arasında taşıma
    current.splice(source.index, 1); // Orijinal listeden öğeyi çıkar
    next.splice(destination.index, 0, target); // Hedef listeye öğeyi ekle

    // indexInList değerlerini güncelle
    const updatedCurrent = current.map((item, index) => ({
        ...item,
        indexInList: index,
    }));

    const updatedNext = next.map((item, index) => ({
        ...item,
        indexInList: index,
    }));

    const result = {
        ...itemsMap,
        [source.droppableId]: updatedCurrent,
        [destination.droppableId]: updatedNext,
    };

    return {
        quoteMap: result,
    };
};