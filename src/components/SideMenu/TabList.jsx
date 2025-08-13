import { useState, useEffect, useMemo } from "react";
import Tab from "./Tab";
import NewTabButton from "./NewTabButton";

export default function TabList({ userTabs, currentTab, setCurrentTab, addUserTab, deleteUserTab, updateTab }) {
    const defaultTabs = useMemo(() => [
        {
            id: "all",
            name: "All",
            canEdit: false
        },
        {
            id: "timeline",
            name: "Timeline",
            canEdit: false
        },
        {
            id: "completed",
            name: "Completed",
            canEdit: false
        }
    ], []);

    const [isAddingTab, setIsAddingTab] = useState(false);
    const [tabs, setTabs] = useState([]);

    useEffect(() => {
        setTabs([...defaultTabs, ...userTabs.map(tab => ({ ...tab, canEdit: true }))]);
    }, [defaultTabs, userTabs])

    const addTab = (name) => {
        addUserTab(name);
        setIsAddingTab(false);
    }

    const deleteTab = (tabId) => {
        if (currentTab === tabId) {
            setCurrentTab("all");
        }
        deleteUserTab(tabId);
    }

    const handleTabClick = (tabId) => {
        setCurrentTab(tabId);
    }

    return (
        <div className="tab-list">
            {tabs.map((tab) => <Tab key={tab.id} {...{ tab, currentTab, deleteTab, updateTab, handleTabClick }}/>)}
            <NewTabButton {...{ setIsAddingTab, addTab, isAddingTab }} />
        </div>
    )
}