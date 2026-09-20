import pytest


def test_syndicate_graph_topology_and_clustering(client):
    resp = client.get("/api/syndicate/graph")
    assert resp.status_code == 200
    data = resp.json()

    assert "nodes" in data
    assert "edges" in data
    assert "clusters" in data
    assert "centrality" in data
    assert "metrics" in data

    nodes = data["nodes"]
    edges = data["edges"]
    clusters = data["clusters"]
    centrality = data["centrality"]

    assert len(nodes) > 0
    assert len(edges) > 0
    assert len(clusters) > 0
    assert len(centrality) > 0

    # Check that high-influence node has centrality computed
    assert "node-vicky" in centrality
    assert centrality["node-vicky"] > 0.2


def test_v1_graph_alias(client):
    resp = client.get("/api/v1/graph")
    assert resp.status_code == 200
    data = resp.json()
    assert "nodes" in data
    assert "links" in data  # Contract compatibility


def test_path_resolve_dijkstra_success(client):
    payload = {
        "source": "node-vicky",
        "target": "node-rahul-mule",
        "maxHops": 5,
        "includeFinancialOnly": False,
    }
    resp = client.post("/api/path/resolve", json=payload)
    assert resp.status_code == 200
    data = resp.json()

    assert data["path_exists"] is True
    assert len(data["nodes"]) >= 2
    assert data["nodes"][0] == "node-vicky"
    assert data["nodes"][-1] == "node-rahul-mule"
    assert len(data["edges"]) >= 1
    assert "evidenceChain" in data
    assert len(data["evidenceChain"]) > 0


def test_path_resolve_missing_source_or_target_returns_400(client):
    resp = client.post("/api/path/resolve", json={"source": "node-vicky"})
    assert resp.status_code == 400


def test_path_resolve_nonexistent_node_returns_404(client):
    payload = {"source": "node-vicky", "target": "nonexistent-entity-999"}
    resp = client.post("/api/path/resolve", json=payload)
    assert resp.status_code == 404


def test_path_resolve_no_path_returns_path_exists_false(client):
    # Two existing nodes with financial-only filter having no direct financial path
    payload = {
        "source": "node-deepak-sim",
        "target": "node-kashi-bullion",
        "includeFinancialOnly": True,
    }
    resp = client.post("/api/path/resolve", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["path_exists"] is False
    assert data["nodes"] == []
