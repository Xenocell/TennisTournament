
class TransitionRepository {
    constructor(db) {
        this.db = db;
    }
    async get_transition() {
        const str_query = "SELECT count_week, DATE_FORMAT(start_week,'%Y-%m-%d') AS start_week, DATE_FORMAT(ADDDATE(start_week, INTERVAL 4 WEEK),'%Y-%m-%d') as end_week FROM transition"
        return await this.db.query_async(str_query);
    }

    async update_status_entries(tournament_id, player_id, status){
        const str_query = "UPDATE tournaments_entries SET status={0}, update_at=NOW() WHERE tournament_id={1} AND player_id={2} LIMIT 1".format(
            status,
            tournament_id,
            player_id
        )
        return await this.db.query_async(str_query);
    }

    
}

module.exports = { TransitionRepository }