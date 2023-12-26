import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    FlatList,
    Modal,
} from 'react-native';
import React, { useEffect, useState } from 'react';
//Firestore
import firestore from '@react-native-firebase/firestore';
//Icons
import Icons from 'react-native-vector-icons/Feather';

const Todo = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [newdes, setNewdes] = useState('');
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editMode1, setEditMode1] = useState(false);

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('todos')
            .onSnapshot(snapshot => {
                const todosData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setTodos(todosData);
            });
        return () => unsubscribe();
    }, []);

    const handleAddTodo = () => {
        if (newTodo === '') return;
        firestore()
            .collection('todos')
            .add({ Title: newTodo, Description: newdes, completed: false });
        setNewTodo('');
        setNewdes('');
        setEditMode1(false);
    };

    const handleToggleTodo = todo => {
        firestore()
            .collection('todos')
            .doc(todo.id)
            .update({ completed: !todo.completed });
    };

    const handleOpenEditModal = todo => {
        setSelectedTodo(todo);
        setEditMode(true);
    };

    const handleOpenEditModal1 = () => {
        setEditMode1(true);
    };

    const handleEditTodo = () => {
        if (selectedTodo === null) return;
        firestore()
            .collection('todos')
            .doc(selectedTodo.id)
            .update({
                Title: selectedTodo.Title,
                Description: selectedTodo.Description,
            });
        setSelectedTodo(null);
        setEditMode(false);
    };

    const handleDeleteTodo = () => {
        if (selectedTodo === null) return;
        firestore().collection('todos').doc(selectedTodo.id).delete();
        setSelectedTodo(null);
        setEditMode(false);
    };

    return (
        <View style={styles.mainwrapper}>
            <Text style={styles.headtxt}>To-Do List</Text>
            <TextInput
                placeholder="Search"
                placeholderTextColor={'#343148FF'}
                keyboardType="web-search"
                style={styles.search}
                enterKeyHint='search'
            />
            <FlatList
                data={todos}
                renderItem={({ item }) => (
                    <View style={styles.list}>
                        <Text
                            onPress={() => handleOpenEditModal(item)}
                            style={styles.titles}>
                            {item.Title}
                        </Text>
                        <TouchableOpacity
                            onPress={() => handleToggleTodo(item)}
                            style={styles.compbtn}>
                            <Text style={styles.comptxt}>
                                {item.completed ? 'Completed' : 'Incomplete'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
                ItemSeparatorComponent={() => <View style={styles.seperater}></View>}
            />
            <TouchableOpacity style={styles.addbtn} onPress={handleOpenEditModal1}>
                <Icons name={'plus'} size={38} color={'#343148FF'} />
            </TouchableOpacity>
            <Modal
                visible={editMode}
                animationType="slide"
                transparent
                onRequestClose={() => setEditMode(false)}>
                <View style={styles.addmodal}>
                    <Text style={styles.headtxt}>Edit To-do</Text>
                    <TextInput
                        style={styles.inputs}
                        value={selectedTodo?.Title}
                        onChangeText={text =>
                            setSelectedTodo({ ...selectedTodo, Title: text })
                        }
                        enterKeyHint='next'
                    />
                    <TextInput
                        style={styles.inputs}
                        value={selectedTodo?.Description}
                        onChangeText={text =>
                            setSelectedTodo({ ...selectedTodo, Description: text })
                        }
                        enterKeyHint='done'
                    />
                    <TouchableOpacity onPress={handleEditTodo} style={styles.modbtn}>
                        <Text style={styles.comptxt}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDeleteTodo} style={styles.modbtn}>
                        <Text style={styles.comptxt}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            <Modal
                visible={editMode1}
                animationType="slide"
                transparent
                onRequestClose={() => setEditMode1(false)}>
                <View style={styles.addmodal}>
                    <Text style={styles.headtxt}>Add To-do</Text>
                    <TextInput
                        style={styles.inputs}
                        value={newTodo}
                        onChangeText={setNewTodo}
                        placeholder="Title"
                        placeholderTextColor={'#343148FF'}
                        enterKeyHint='next'
                    />
                    <TextInput
                        style={styles.inputs}
                        value={newdes}
                        onChangeText={setNewdes}
                        placeholder="Description"
                        placeholderTextColor={'#343148FF'}
                        enterKeyHint='done'
                    />
                    <TouchableOpacity onPress={handleAddTodo} style={styles.modbtn}>
                        <Text style={styles.comptxt}>Add</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

export default Todo;

const styles = StyleSheet.create({
    mainwrapper: {
        flex: 1,
        backgroundColor: '#343148FF',
        padding: 10,
    },
    headtxt: {
        fontSize: 30,
        fontFamily: 'Grandista',
        color: '#D7C49EFF',
        textAlign: 'center',
        marginVertical: 20,
    },
    addbtn: {
        width: 45,
        height: 45,
        position: 'absolute',
        marginTop: 680,
        marginLeft: 280,
        backgroundColor: '#D7C49EFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
    },
    list: {
        width: '100%',
        height: 60,
        margin: 5,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
    },
    titles: {
        fontFamily: 'Nunito-Bold',
        fontSize: 20,
        color: '#D7C49EFF',
    },
    seperater: {
        width: '100%',
        height: 1,
        backgroundColor: '#858282',
        opacity: 0.2,
    },
    compbtn: {
        width: 100,
        height: 40,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D7C49EFF',
        elevation: 7,
        position: 'absolute',
        marginLeft: 220,
    },
    comptxt: {
        color: '#343148FF',
        fontSize: 14,
        fontFamily: 'Nunito-Bold',
    },
    search: {
        width: 300,
        height: 45,
        backgroundColor: '#FAF9F6',
        borderRadius: 30,
        color: '#343148FF',
        paddingLeft: 20,
        elevation: 7,
        fontSize: 18,
        fontFamily: 'Nunito-Medium',
        alignSelf: 'center',
        marginVertical: 20,
    },
    addmodal: {
        width: '90%',
        height: 400,
        backgroundColor: '#343148FF',
        alignSelf: 'center',
        borderRadius: 30,
        borderWidth: 4,
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderColor: '#D7C49EFF',
        marginTop: 180,
        padding: 20,
    },
    inputs: {
        width: 250,
        height: 40,
        backgroundColor: '#FAF9F6',
        borderRadius: 10,
        color: '#343148FF',
        paddingLeft: 20,
        elevation: 7,
        fontSize: 14,
        fontFamily: 'Nunito-Medium',
        alignSelf: 'center',
        marginVertical: 10,
    },
    modbtn: {
        width: 100,
        height: 40,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D7C49EFF',
        elevation: 7,
        marginTop: 20,
        alignSelf: 'center',
    },
});
