import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect } from "react";
import { Button, Image, SafeAreaView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import * as SQLite from 'expo-sqlite';
import { useRouter, useLocalSearchParams } from "expo-router";
import { useIsFocused } from '@react-navigation/native';

export default function UpdateContact() {

    const { id } = useLocalSearchParams();

    const isFocused = useIsFocused();

    const router = useRouter();

    const [name, onChangeName] = useState('');
    const [mobileNumber, onChangeMobileNumber] = useState('');
    const [homeNumber, onChangeHomeNumber] = useState('');

    const [isFavourite, setIsFavourite] = useState(false);
    const toggleSwitch = () => setIsFavourite(previousState => !previousState);

    const [image, setImage] = useState(null);

    useEffect(() => {

        if (isFocused) {

            SQLite.openDatabase('contacts.db', undefined, undefined, undefined, (db) => {
                db.transaction(tx => {
                    tx.executeSql('SELECT * FROM contact WHERE id == ?', [id],
                        (txObj, result) => {
                            onChangeName(result.rows._array[0].name);
                            onChangeMobileNumber(result.rows._array[0].mobileNo);
                            onChangeHomeNumber(result.rows._array[0].homeNo);
                            setIsFavourite((result.rows._array[0].isFavourite == 1));
                            setImage(result.rows._array[0].imageUrl);
                        },
                        (txObj, error) => console.log(error)
                    );
                });

            })

        }

    }, [isFocused]);

    const update = () => {

        SQLite.openDatabase('contacts.db', undefined, undefined, undefined, (db) => {

            db.transaction(tx => {
                tx.executeSql('UPDATE contact SET name = ?, mobileNo = ?, homeNo = ?, isFavourite = ?, imageUrl = ? WHERE id == ?', [name, mobileNumber, homeNumber, isFavourite, image, id],
                    (txObj, result) => {
                        console.log(result);
                        router.back();
                    },
                    (txObj, error) => {
                        console.log(error);
                    }
                )
            });

        });

    };

    const remove = () => {

        SQLite.openDatabase('contacts.db', undefined, undefined, undefined, (db) => {

            db.transaction(tx => {
                tx.executeSql('DELETE FROM contact WHERE id == ?', [id],
                    (txObj, result) => {
                        console.log(result);
                        router.back();
                    },
                    (txObj, error) => {
                        console.log(error);
                    }
                )
            });

        });

    };

    const pickImage = async () => {

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }

    };


    return <SafeAreaView style={styles.container}>

        <TextInput
            style={styles.input}
            onChangeText={onChangeName}
            placeholder="Name"
            value={name}
        />
        <TextInput
            style={styles.input}
            onChangeText={onChangeMobileNumber}
            value={mobileNumber}
            placeholder="Mobile Number"
            keyboardType="numeric"
        />
        <TextInput
            style={styles.input}
            onChangeText={onChangeHomeNumber}
            value={homeNumber}
            placeholder="Home Number"
            keyboardType="numeric"
        />

        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingRight: 12 }}>
            <Text>Favourite</Text>
            <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isFavourite ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isFavourite}
            />
        </View>

        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
            <Button title="Pick an image from camera roll" onPress={pickImage} />
            {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        </View>

        <View style={styles.actions}>
            <View style={styles.save}>
                <Button title="Update" onPress={update} color={'#008800'} />
            </View>
            <View style={styles.save}>
                <Button title="Delete" onPress={remove} color={'#880000'} />
            </View>
        </View>

    </SafeAreaView>;


}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    item: {
        marginBottom: 10,
        backgroundColor: '#CCCCCC',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    itemDetails: {
        display: 'flex',
        flexDirection: 'column'
    },
    itemActions: {
        alignSelf: 'center'
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5
    },
    save: {
        marginBottom: 5
    },
    actions: {
        margin: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 10
    }
});