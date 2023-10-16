import { useIsFocused } from '@react-navigation/native';
import { Link } from "expo-router";
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from "react";
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Favourites() {

    const isFocused = useIsFocused();

    const [contacts, setContacts] = useState([]);

    useEffect(() => {

        if (isFocused) {

            SQLite.openDatabase('contacts.db', undefined, undefined, undefined, (db) => {

                db.transaction(tx => {
                    tx.executeSql('SELECT * FROM contact WHERE isFavourite == 1', null,
                        (txObj, resultSet) => {
                            setContacts(resultSet.rows._array);
                        },
                        (txObj, error) => console.log(error)
                    );
                });

            })

        }

    }, [isFocused]);

    return <SafeAreaView style={styles.container}>
        {
            (contacts.length <= 0) && <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Text>No Contacts</Text>
            </View>
        }
        <ScrollView>
            {
                contacts.map(contact => {
                    return <Link href={{
                        pathname: `/contact/${contact.id}`
                    }} asChild key={contact.id}>
                        <Pressable>
                            <View style={styles.item}>
                                <View style={styles.itemDetails}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{contact.name}</Text>
                                    <Text>{contact.mobileNo} (Mobile)</Text>
                                    <Text>{contact.homeNo} (Home)</Text>
                                    <Text style={{ fontWeight: 'bold', color: '#EE0000' }}>{(contact.isFavourite === 1) ? 'FAVOURITE' : ''}</Text>
                                </View>
                                <View style={styles.itemActions}>
                                    <Text>Press to edit</Text>
                                    {contact.imageUrl && <Image source={{ uri: contact.imageUrl }} style={{ width: 100, height: 100 }} />}
                                </View>
                            </View>
                        </Pressable>
                    </Link>
                })
            }
        </ScrollView>
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
        margin: 12
    }
});